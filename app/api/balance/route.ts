import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { balances, transactions } from "@/lib/schema";
import { eq, and, desc, gt } from "drizzle-orm";
import { getExchangeRates } from "@/lib/exchange-rates";
import { BalanceData, Transaction, CurrencyCode } from "@/types/balance";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = parseInt(url.searchParams.get("userId") || "0");
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
    }

    // Query balances
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

    // Query transactions
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

    // Fetch exchange rates
    const exchangeRates = await getExchangeRates("USD");

    // Generate historical balance data for BalanceChart
    const historicalData = await generateHistoricalBalanceData(userId);

    return NextResponse.json({
      balances: balancesData,
      exchangeRates,
      transactions: transactionsData,
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
  const txRecords = await db
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

  const historicalData: Array<{ date: string; USD: number; EUR: number; CNY: number; JPY: number }> = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const snapshot = { ...balancesMap };

    for (const tx of txRecords) {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);
      if (txDate > date) {
        const amount = parseFloat(tx.amount);
        if (tx.type === "deposit") {
          snapshot[tx.currency as CurrencyCode] -= amount;
        } else if (tx.type === "withdrawal") {
          snapshot[tx.currency as CurrencyCode] += amount;
        } else if (tx.type === "transfer" && tx.targetCurrency) {
          snapshot[tx.currency as CurrencyCode] += amount;
          snapshot[tx.targetCurrency as CurrencyCode] -= amount;
        } else if (tx.type === "refund") {
          snapshot[tx.currency as CurrencyCode] += amount;
        }
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