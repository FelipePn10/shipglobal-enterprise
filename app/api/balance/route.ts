import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { balances, transactions } from "@/lib/schema";
import { eq, and, desc, gt } from "drizzle-orm";
import { getExchangeRates } from "@/lib/exchange-rates";
import { WithId } from "mongodb";
import { TransactionCollection } from "@/lib/mongo/collections/transactions";
import { CurrencyCode, TransactionType, TransactionStatus } from "@/lib/mongoModels";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Unified transaction type
interface UnifiedTransaction {
  source: "mysql" | "mongo";
  id: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  date: string;
  status: TransactionStatus;
  description?: string;
  paymentIntentId?: string;
  targetCurrency?: CurrencyCode;
}

interface BalanceData {
  [currency: string]: {
    amount: number;
    lastUpdated: string;
  };
}

interface HistoricalBalanceData {
  date: string;
  USD: number;
  EUR: number;
  CNY: number;
  JPY: number;
}

interface MongoTransactionDocument {
  _id: ObjectId;
  userId: number;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  status: TransactionStatus;
  description?: string;
  metadata: {
    paymentIntentId?: string;
    relatedEntities?: {
      importId?: string;
    };
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

type MongoTransactionWithId = WithId<MongoTransactionDocument>;

// Strongly typed MongoDB transaction type guard
function isMongoTransaction(tx: unknown): tx is MongoTransactionWithId {
  if (!tx || typeof tx !== "object") return false;

  const transaction = tx as Record<string, unknown>;

  try {
    // Check required properties
    if (
      !(transaction._id instanceof ObjectId) ||
      typeof transaction.userId !== "number" ||
      typeof transaction.type !== "string" ||
      typeof transaction.amount !== "number" ||
      typeof transaction.currency !== "string" ||
      typeof transaction.status !== "string" ||
      !(transaction.createdAt instanceof Date) ||
      !(transaction.updatedAt instanceof Date) ||
      typeof transaction.metadata !== "object" ||
      transaction.metadata === null
    ) {
      return false;
    }

    // Validate TransactionType enum
    const validTypes: TransactionType[] = [
      "deposit",
      "withdrawal",
      "purchase",
      "transfer",
      "refund",
    ];
    if (!validTypes.includes(transaction.type as TransactionType)) {
      return false;
    }

    // Validate CurrencyCode enum
    const validCurrencies: CurrencyCode[] = ["USD", "EUR", "CNY", "JPY", "BRL"];
    if (!validCurrencies.includes(transaction.currency as CurrencyCode)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Transaction validation error:", error);
    return false;
  }
}

/**
 * Fetches user balances, transactions, exchange rates, and historical balance data
 * @route GET /api/balance
 * @param req - The incoming request with userId query parameter
 * @returns JSON response with balances, exchange rates, transactions, and historical data
 */
export async function GET(req: Request) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.type !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const userId = parseInt(url.searchParams.get("userId") || "0");

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    // Verify user ID matches session
    const sessionUserId = parseInt(session.user.id);
    if (userId !== sessionUserId) {
      return NextResponse.json(
        { error: "Unauthorized: userId does not match session" },
        { status: 403 }
      );
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

    const balancesData: BalanceData = {};
    const supportedCurrencies: CurrencyCode[] = ["USD", "EUR", "CNY", "JPY"];

    supportedCurrencies.forEach((currency) => {
      balancesData[currency] = {
        amount: 0,
        lastUpdated: new Date().toISOString(),
      };
    });

    balanceRecords.forEach((record) => {
      if (supportedCurrencies.includes(record.currency as CurrencyCode)) {
        balancesData[record.currency] = {
          amount: parseFloat(record.amount),
          lastUpdated: record.lastUpdated.toISOString(),
        };
      }
    });

    // Query transactions
    const [mysqlTransactions, mongoTransactionsRaw] = await Promise.all([
      db
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
        .limit(50),

      TransactionCollection.findByUserId(userId, {}, { limit: 50 })
        .catch((error) => {
          console.error("MongoDB transaction query error:", error);
          return [];
        }),
    ]);

    // Process MongoDB transactions with proper type checking
    const mongoTransactions = mongoTransactionsRaw
      .filter((tx): tx is MongoTransactionWithId => isMongoTransaction(tx))
      .map((tx) => ({
        _id: tx._id,
        userId: tx.userId,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        status: tx.status,
        description: tx.description,
        metadata: tx.metadata || {},
        createdAt: new Date(tx.createdAt),
        updatedAt: new Date(tx.updatedAt),
      }));

    // Process MySQL transactions
    const mysqlTxProcessed: UnifiedTransaction[] = mysqlTransactions.map((tx) => ({
      source: "mysql",
      id: `tx-${tx.id}`,
      type: tx.type as TransactionType,
      amount: parseFloat(tx.amount),
      currency: tx.currency as CurrencyCode,
      date: tx.date.toISOString(),
      status: tx.status as TransactionStatus,
      description: tx.description || undefined,
      paymentIntentId: tx.paymentIntentId || undefined,
      targetCurrency: tx.targetCurrency as CurrencyCode | undefined,
    }));

    // Process MongoDB transactions
    const mongoTxProcessed: UnifiedTransaction[] = mongoTransactions.map((tx) => ({
      source: "mongo",
      id: tx._id.toString(),
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency,
      date: tx.createdAt.toISOString(),
      status: tx.status,
      description: tx.description,
      paymentIntentId: tx.metadata.paymentIntentId,
    }));

    // Combine transactions
    const combinedTransactions = [...mysqlTxProcessed, ...mongoTxProcessed]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 100);

    // Fetch additional data
    const [exchangeRates, historicalData] = await Promise.all([
      getExchangeRates("USD"),
      generateHistoricalBalanceData(userId),
    ]);

    return NextResponse.json({
      balances: balancesData,
      exchangeRates,
      transactions: combinedTransactions,
      historicalData,
    });
  } catch (error: unknown) {
    console.error("Balance Fetch Error:", {
      error,
      userId: parseInt(new URL(req.url).searchParams.get("userId") || "0") || 0,
    });
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch balance";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * Generates historical balance data for the past 30 days
 * @param userId - The ID of the user
 * @returns Array of historical balance snapshots
 */
async function generateHistoricalBalanceData(
  userId: number
): Promise<HistoricalBalanceData[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [mysqlTxRecords, mongoTxRecordsRaw] = await Promise.all([
    db
      .select({
        date: transactions.date,
        type: transactions.type,
        amount: transactions.amount,
        currency: transactions.currency,
        targetCurrency: transactions.targetCurrency,
      })
      .from(transactions)
      .where(
        and(eq(transactions.userId, userId), gt(transactions.date, thirtyDaysAgo))
      )
      .orderBy(transactions.date),

    TransactionCollection.findByUserId(userId, {
      dateRange: {
        start: thirtyDaysAgo,
        end: new Date(),
      },
    }).catch((error) => {
      console.error("MongoDB historical transaction query error:", error);
      return [];
    }),
  ]);

  // Process MongoDB transactions with proper type checking
  const mongoTxRecords = mongoTxRecordsRaw
    .filter((tx): tx is MongoTransactionWithId => isMongoTransaction(tx))
    .map((tx) => ({
      _id: tx._id,
      userId: tx.userId,
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      description: tx.description,
      metadata: tx.metadata || {},
      createdAt: new Date(tx.createdAt),
      updatedAt: new Date(tx.updatedAt),
    }));

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
    BRL: 0,
  };

  currentBalances.forEach((balance) => {
    const currency = balance.currency as CurrencyCode;
    if (currency in balancesMap) {
      balancesMap[currency] = parseFloat(balance.amount);
    }
  });

  // Generate historical data
  const historicalData: HistoricalBalanceData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const snapshot = { ...balancesMap };

    // Process transactions
    const allTransactions = [
      ...mysqlTxRecords.map((tx) => ({
        source: "mysql" as const,
        date: tx.date,
        type: tx.type as TransactionType,
        amount: parseFloat(tx.amount),
        currency: tx.currency as CurrencyCode,
        targetCurrency: tx.targetCurrency as CurrencyCode | undefined,
      })),
      ...mongoTxRecords.map((tx) => ({
        source: "mongo" as const,
        date: tx.createdAt,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        targetCurrency: tx.metadata?.relatedEntities?.importId as
          | CurrencyCode
          | undefined,
      })),
    ];

    for (const tx of allTransactions) {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);

      if (txDate > date) {
        updateBalanceSnapshot(
          snapshot,
          tx.type,
          tx.currency,
          tx.targetCurrency,
          tx.amount
        );
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

/**
 * Updates a balance snapshot based on transaction details
 * @param snapshot - The current balance snapshot
 * @param type - The transaction type
 * @param currency - The transaction currency
 * @param targetCurrency - The target currency for transfers
 * @param amount - The transaction amount
 */
function updateBalanceSnapshot(
  snapshot: Record<CurrencyCode, number>,
  type: TransactionType,
  currency: CurrencyCode,
  targetCurrency: CurrencyCode | undefined,
  amount: number
): void {
  switch (type) {
    case "deposit":
      snapshot[currency] -= amount;
      break;
    case "withdrawal":
      snapshot[currency] += amount;
      break;
    case "transfer":
      if (targetCurrency) {
        snapshot[currency] += amount;
        snapshot[targetCurrency] -= amount;
      }
      break;
    case "refund":
      snapshot[currency] += amount;
      break;
  }
}