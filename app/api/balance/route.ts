import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { balances, transactions } from "@/lib/schema";
import { eq, and, desc, gt } from "drizzle-orm";
import { getExchangeRates } from "@/lib/exchange-rates";
import { BalanceData, Transaction, CurrencyCode } from "@/types/balance";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.type !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

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
      acc[record.currency as CurrencyCode] = {
        amount: parseFloat(record.amount as string),
        lastUpdated: (record.lastUpdated as Date).toISOString(),
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

    // Query transactions (last 30 days for history)
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
      .where(
        and(
          eq(transactions.userId, userId),
          // Optional: Filter last 30 days
          gt(transactions.date, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        )
      )
      .orderBy(desc(transactions.date))
      .limit(100); // Reasonable limit for UI

    const transactionsData: Transaction[] = transactionRecords.map((record) => ({
      id: `tx-${record.id}`,
      type: record.type as Transaction["type"],
      amount: parseFloat(record.amount as string),
      currency: record.currency as CurrencyCode,
      date: (record.date as Date).toISOString(),
      status: record.status as Transaction["status"],
      description: typeof record.description === "string" ? record.description : undefined,
      paymentIntentId: typeof record.paymentIntentId === "string" ? record.paymentIntentId : undefined,
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

// Helper to generate historical balance data
async function generateHistoricalBalanceData(userId: number) {
  // Get transactions from the last 30 days
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

  // Get current balances
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
    if (["USD", "EUR", "CNY", "JPY"].includes(b.currency as string)) {
      balancesMap[b.currency as CurrencyCode] = parseFloat(b.amount as string);
    }
  });

  // Generate daily snapshots (backwards from today)
  const historicalData: Array<{ date: string; USD: number; EUR: number; CNY: number; JPY: number }> = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const snapshot = { ...balancesMap };

    // Adjust balances based on transactions after this date
    for (const tx of txRecords) {
      const txDate = new Date(tx.date as unknown as string);
      txDate.setHours(0, 0, 0, 0);
      if (txDate > date) {
        const amount = parseFloat(tx.amount as string);
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

  return historicalData.reverse(); // Oldest to newest
}