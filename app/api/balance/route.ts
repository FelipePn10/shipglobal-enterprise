import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { balances, transactions } from "@/lib/schema";
import { eq, and, desc, gt } from "drizzle-orm";
import { getExchangeRates } from "@/lib/exchange-rates";
import { BalanceData, Transaction, CurrencyCode } from "@/types/balance";

import { Transaction as MongoTransaction } from "@/lib/mongoModels";
import clientPromise from "@/lib/mongo";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = parseInt(url.searchParams.get("userId") || "0");
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
    }

    // Query balances from MySQL
    const balanceRecords = await db
      .select({
        currency: balances.currency,
        amount: balances.amount,
        lastUpdated: balances.lastUpdated,
      })
      .from(balances)
      .where(eq(balances.userId, userId));

    const balancesData: BalanceData = balanceRecords.reduce((acc, record) => {
      acc[record.currency] = {
        amount: parseFloat(record.amount),
        lastUpdated: record.lastUpdated.toISOString(),
      };
      return acc;
    }, {} as BalanceData);

    // Ensure all supported currencies are present
    const supportedCurrencies: CurrencyCode[] = ["USD", "EUR", "CNY", "JPY"];
    for (const currency of supportedCurrencies) {
      if (!balancesData[currency]) {
        balancesData[currency] = { amount: 0, lastUpdated: new Date().toISOString() };
      }
    }

    // Query transactions from MySQL
    const transactionRecords = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        currency: transactions.currency,
        date: transactions.date,
        status: transactions.status,
        description: transactions.description,
        paymentIntentId: transactions.paymentIntentId,
        targetCurrency: transactions.targetCurrency,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
      .limit(100);

    const transactionsData: Transaction[] = transactionRecords.map((record) => ({
      id: `tx-${record.id}`,
      type: record.type as Transaction["type"],
      amount: parseFloat(record.amount),
      currency: record.currency as CurrencyCode,
      date: record.date.toISOString(),
      status: record.status as Transaction["status"],
      description: record.description || undefined,
      paymentIntentId: record.paymentIntentId || undefined,
      targetCurrency: record.targetCurrency as CurrencyCode | undefined,
    }));

    // Query recent transactions from MongoDB
    const mongoClient = await clientPromise;
    const mongoDb = mongoClient.db();
    const mongoTransactions = await mongoDb
      .collection<MongoTransaction>("transactions")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const mongoTransactionsData = mongoTransactions.map((tx: MongoTransaction) => ({
      id: tx._id?.toString() ?? "unknown-id",
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency,
      date: tx.createdAt.toISOString(),
      status: tx.status,
      description: tx.description,
      paymentIntentId: tx.paymentIntentId,
      metadata: tx.metadata,
    }));

    // Fetch exchange rates
    const exchangeRates = await getExchangeRates("USD");

    // Generate historical balance data
    const historicalData = await generateHistoricalBalanceData(userId);

    return NextResponse.json({
      balances: balancesData,
      exchangeRates,
      transactions: transactionsData,
      mongoTransactions: mongoTransactionsData,
      historicalData,
    });
  } catch (error: any) {
    console.error("Balance Fetch Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch balance" },
      { status: 500 }
    );
  }
}

async function generateHistoricalBalanceData(userId: number) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  // Query transactions from both MySQL and MongoDB
  const mysqlTxRecords = await db
    .select({
      date: transactions.date,
      type: transactions.type,
      amount: transactions.amount,
      currency: transactions.currency,
      targetCurrency: transactions.targetCurrency,
    })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), gt(transactions.date, thirtyDaysAgo)))
    .orderBy(transactions.date);

  const mongoClient = await clientPromise;
  const mongoTxRecords = await mongoClient
    .db()
    .collection("transactions")
    .find({
      userId,
      createdAt: { $gt: thirtyDaysAgo },
    })
    .sort({ createdAt: 1 })
    .toArray();

  const currentBalances = await db
    .select({
      currency: balances.currency,
      amount: balances.amount,
    })
    .from(balances)
    .where(eq(balances.userId, userId));

  const balancesMap: Record<CurrencyCode, number> = {
    USD: 0,
    EUR: 0,
    CNY: 0,
    JPY: 0,
  };
  currentBalances.forEach((b) => {
    if (["USD", "EUR", "CNY", "JPY"].includes(b.currency)) {
      balancesMap[b.currency as CurrencyCode] = parseFloat(b.amount);
    }
  });

  const historicalData: Array<{
    date: string;
    USD: number;
    EUR: number;
    CNY: number;
    JPY: number;
  }> = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const snapshot = { ...balancesMap };

    // Process MySQL transactions
    for (const tx of mysqlTxRecords) {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);
      if (txDate > date) {
        const amount = parseFloat(tx.amount);
        updateBalanceSnapshot(snapshot, tx.type, tx.currency, tx.targetCurrency ?? undefined, amount);
      }
    }

    // Process MongoDB transactions
    for (const tx of mongoTxRecords) {
      const txDate = new Date(tx.createdAt);
      txDate.setHours(0, 0, 0, 0);
      if (txDate > date) {
        updateBalanceSnapshot(snapshot, tx.type, tx.currency, tx.metadata?.targetCurrency, tx.amount);
      }
    }

    historicalData.push({
      date: dateStr,
      USD: Math.max(0, snapshot.USD),
      EUR: Math.max(0, snapshot.EUR),
      CNY: Math.max(0, snapshot.CNY),
      JPY: Math.max(0, snapshot.JPY),
    });
  }

  return historicalData.reverse();
}

function updateBalanceSnapshot(
  snapshot: Record<CurrencyCode, number>,
  type: string,
  currency: string,
  targetCurrency: string | undefined,
  amount: number
) {
  if (type === "deposit") {
    snapshot[currency as CurrencyCode] -= amount;
  } else if (type === "withdrawal") {
    snapshot[currency as CurrencyCode] += amount;
  } else if (type === "transfer" && targetCurrency) {
    snapshot[currency as CurrencyCode] += amount;
    snapshot[targetCurrency as CurrencyCode] -= amount;
  } else if (type === "refund") {
    snapshot[currency as CurrencyCode] += amount;
  }
}