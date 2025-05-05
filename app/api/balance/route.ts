// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { balances, transactions } from "@/lib/schema";
// import { eq, and, desc, gt } from "drizzle-orm";
// import { getExchangeRates } from "@/lib/exchange-rates";
// import { ObjectId } from "mongodb";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import { TransactionCollection } from "@/lib/mongo/collections/transactions";

// // Unified enums with const assertion for type safety
// const TransactionTypes = ["deposit", "withdrawal", "purchase", "transfer", "refund"] as const;
// export type TransactionType = typeof TransactionTypes[number];

// const CurrencyCodes = ["USD", "EUR", "CNY", "JPY", "BRL"] as const;
// export type CurrencyCode = typeof CurrencyCodes[number];

// const TransactionStatuses = ["pending", "completed", "failed", "cancelled"] as const;
// export type TransactionStatus = typeof TransactionStatuses[number];

// // Interfaces
// interface UnifiedTransaction {
//   source: "mysql" | "mongo";
//   id: string;
//   type: TransactionType;
//   amount: number;
//   currency: CurrencyCode;
//   date: string;
//   status: TransactionStatus;
//   description?: string;
//   paymentIntentId?: string;
//   targetCurrency?: CurrencyCode;
// }

// type BalanceData = {
//   [K in CurrencyCode]: {
//     amount: number;
//     lastUpdated: string;
//   };
// };

// interface HistoricalBalanceData {
//   date: string;
//   USD: number;
//   EUR: number;
//   CNY: number;
//   JPY: number;
// }

// interface MongoTransactionDocument {
//   _id: ObjectId;
//   userId: number;
//   type: TransactionType;
//   amount: number;
//   currency: CurrencyCode;
//   status: TransactionStatus;
//   description?: string;
//   metadata: {
//     paymentIntentId?: string;
//     relatedEntities?: {
//       importId?: string;
//     };
//     [key: string]: unknown;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Type guard for MongoDB transactions
// function isMongoTransaction(tx: unknown): tx is MongoTransactionDocument {
//   if (!tx || typeof tx !== "object") return false;

//   const transaction = tx as Record<string, unknown>;

//   try {
//     if (
//       !(transaction._id instanceof ObjectId) ||
//       typeof transaction.userId !== "number" ||
//       typeof transaction.type !== "string" ||
//       typeof transaction.amount !== "number" ||
//       typeof transaction.currency !== "string" ||
//       typeof transaction.status !== "string" ||
//       !(transaction.createdAt instanceof Date) ||
//       !(transaction.updatedAt instanceof Date) ||
//       typeof transaction.metadata !== "object" ||
//       transaction.metadata === null
//     ) {
//       return false;
//     }

//     if (!TransactionTypes.includes(transaction.type as TransactionType)) {
//       return false;
//     }

//     if (!CurrencyCodes.includes(transaction.currency as CurrencyCode)) {
//       return false;
//     }

//     if (!TransactionStatuses.includes(transaction.status as TransactionStatus)) {
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error("Transaction validation error:", error);
//     return false;
//   }
// }

// /**
//  * Fetches user balances, transactions, exchange rates, and historical balance data
//  * @route GET /api/balance
//  * @param req - The incoming request with userId query parameter
//  * @returns JSON response with balances, exchange rates, transactions, and historical data
//  */
// export async function GET(req: Request): Promise<NextResponse> {
//   try {
//     // Authenticate user
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user || session.user.type !== "user") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const url = new URL(req.url);
//     const userIdParam = url.searchParams.get("userId");
//     const userId = userIdParam ? parseInt(userIdParam, 10) : NaN;

//     if (isNaN(userId) || userId <= 0) {
//       return NextResponse.json(
//         { error: "Invalid or missing userId" },
//         { status: 400 }
//       );
//     }

//     // Verify user ID matches session
//     const sessionUserId = parseInt(session.user.id, 10);
//     if (userId !== sessionUserId) {
//       return NextResponse.json(
//         { error: "Unauthorized: userId does not match session" },
//         { status: 403 }
//       );
//     }

//     // Query balances
//     const balanceRecords = await db
//       .select({
//         currency: balances.currency,
//         amount: balances.amount,
//         lastUpdated: balances.lastUpdated,
//       })
//       .from(balances)
//       .where(eq(balances.userId, userId));

//     const balancesData: BalanceData = Object.fromEntries(
//       CurrencyCodes.map((currency) => [
//         currency,
//         {
//           amount: 0,
//           lastUpdated: new Date().toISOString(),
//         },
//       ])
//     ) as BalanceData;

//     balanceRecords.forEach((record) => {
//       if (CurrencyCodes.includes(record.currency as CurrencyCode)) {
//         balancesData[record.currency as CurrencyCode] = {
//           amount: parseFloat(record.amount.toString()),
//           lastUpdated: record.lastUpdated.toISOString(),
//         };
//       }
//     });

//     // Query transactions
//     const [mysqlTransactions, mongoTxRecordsRaw] = await Promise.all([
//       db
//         .select({
//           id: transactions.id,
//           type: transactions.type,
//           amount: transactions.amount,
//           currency: transactions.currency,
//           date: transactions.date,
//           status: transactions.status,
//           description: transactions.description,
//           paymentIntentId: transactions.paymentIntentId,
//           targetCurrency: transactions.targetCurrency,
//         })
//         .from(transactions)
//         .where(eq(transactions.userId, userId))
//         .orderBy(desc(transactions.date))
//         .limit(50),

//       TransactionCollection.findByUserId(userId, {}, { limit: 50 }).catch(
//         (error) => {
//           console.error("MongoDB transaction query error:", error);
//           return [];
//         }
//       ) as Promise<MongoTransactionDocument[]>,
//     ]);

//     // Process MongoDB transactions
//     const mongoTransactions = mongoTxRecordsRaw
//       .filter(isMongoTransaction)
//       .map((tx: MongoTransactionDocument) => ({
//         source: "mongo" as const,
//         id: tx._id.toString(),
//         type: tx.type,
//         amount: tx.amount,
//         currency: tx.currency,
//         date: tx.createdAt.toISOString(),
//         status: tx.status,
//         description: tx.description,
//         paymentIntentId: tx.metadata.paymentIntentId,
//       }));

//     // Process MySQL transactions
//     const mysqlTransactionsProcessed: UnifiedTransaction[] = mysqlTransactions
//       .filter(
//         (tx) =>
//           TransactionTypes.includes(tx.type as TransactionType) &&
//           CurrencyCodes.includes(tx.currency as CurrencyCode) &&
//           TransactionStatuses.includes(tx.status as TransactionStatus)
//       )
//       .map((tx) => ({
//         source: "mysql" as const,
//         id: `tx-${tx.id}`,
//         type: tx.type as TransactionType,
//         amount: parseFloat(tx.amount.toString()),
//         currency: tx.currency as CurrencyCode,
//         date: tx.date.toISOString(),
//         status: tx.status as TransactionStatus,
//         description: tx.description ?? undefined,
//         paymentIntentId: tx.paymentIntentId ?? undefined,
//         targetCurrency: tx.targetCurrency as CurrencyCode | undefined,
//       }));

//     // Combine and sort transactions
//     const combinedTransactions = [...mysqlTransactionsProcessed, ...mongoTransactions]
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//       .slice(0, 100);

//     // Fetch additional data
//     const [exchangeRates, historicalData] = await Promise.all([
//       getExchangeRates("USD"),
//       generateHistoricalBalanceData(userId),
//     ]);

//     return NextResponse.json({
//       balances: balancesData,
//       exchangeRates,
//       transactions: combinedTransactions,
//       historicalData,
//     });
//   } catch (error: unknown) {
//     console.error("Balance Fetch Error:", {
//       error,
//       userId: parseInt(new URL(req.url).searchParams.get("userId") ?? "0", 10) || 0,
//     });
//     const errorMessage =
//       error instanceof Error ? error.message : "Failed to fetch balance";
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }

// /**
//  * Generates historical balance data for the past 30 days
//  * @param userId - The ID of the user
//  * @returns Array of historical balance snapshots
//  */
// async function generateHistoricalBalanceData(
//   userId: number
// ): Promise<HistoricalBalanceData[]> {
//   const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

//   const [mysqlTxRecords, mongoTxRecordsRaw] = await Promise.all([
//     db
//       .select({
//         date: transactions.date,
//         type: transactions.type,
//         amount: transactions.amount,
//         currency: transactions.currency,
//         targetCurrency: transactions.targetCurrency,
//       })
//       .from(transactions)
//       .where(
//         and(eq(transactions.userId, userId), gt(transactions.date, thirtyDaysAgo))
//       )
//       .orderBy(transactions.date),

//     TransactionCollection.findByUserId(userId, {
//       dateRange: {
//         start: thirtyDaysAgo,
//         end: new Date(),
//       },
//     }).catch((error) => {
//       console.error("MongoDB historical transaction query error:", error);
//       return [];
//     }) as Promise<MongoTransactionDocument[]>,
//   ]);

//   // Process MongoDB transactions
//   const mongoTxRecords = mongoTxRecordsRaw
//     .filter((tx: MongoTransactionDocument) => isMongoTransaction(tx))
//     .map((tx: MongoTransactionDocument) => ({
//       source: "mongo" as const,
//       date: tx.createdAt,
//       type: tx.type,
//       amount: tx.amount,
//       currency: tx.currency,
//       targetCurrency: tx.metadata?.relatedEntities?.importId as CurrencyCode | undefined,
//     }));

//   // Get current balances
//   const currentBalances = await db
//     .select({
//       currency: balances.currency,
//       amount: balances.amount,
//     })
//     .from(balances)
//     .where(eq(balances.userId, userId));

//   const balancesMap: Record<CurrencyCode, number> = Object.fromEntries(
//     CurrencyCodes.map((currency) => [currency, 0])
//   ) as Record<CurrencyCode, number>;

//   currentBalances.forEach((balance) => {
//     if (CurrencyCodes.includes(balance.currency as CurrencyCode)) {
//       balancesMap[balance.currency as CurrencyCode] = parseFloat(
//         balance.amount.toString()
//       );
//     }
//   });

//   // Generate historical data
//   const historicalData: HistoricalBalanceData[] = [];
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   for (let i = 0; i < 30; i++) {
//     const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
//     const dateStr = date.toISOString().split("T")[0];
//     const snapshot = { ...balancesMap };

//     // Process transactions
//     const allTransactions = [
//       ...mysqlTxRecords
//         .filter((tx: typeof mysqlTxRecords[number]) =>
//           TransactionTypes.includes(tx.type as TransactionType) &&
//           CurrencyCodes.includes(tx.currency as CurrencyCode)
//         )
//         .map((tx: typeof mysqlTxRecords[number]) => ({
//           source: "mysql" as const,
//           date: tx.date,
//           type: tx.type as TransactionType,
//           amount: parseFloat(tx.amount.toString()),
//           currency: tx.currency as CurrencyCode,
//           targetCurrency: tx.targetCurrency as CurrencyCode | undefined,
//         })),
//       ...mongoTxRecords,
//     ];

//     for (const tx of allTransactions) {
//       const txDate = new Date(tx.date);
//       txDate.setHours(0, 0, 0, 0);

//       if (txDate > date) {
//         updateBalanceSnapshot(
//           snapshot,
//           tx.type,
//           tx.currency,
//           tx.targetCurrency,
//           tx.amount
//         );
//       }
//     }

//     historicalData.push({
//       date: dateStr,
//       USD: Math.max(0, snapshot.USD),
//       EUR: Math.max(0, snapshot.EUR),
//       CNY: Math.max(0, snapshot.CNY),
//       JPY: Math.max(0, snapshot.JPY),
//     });
//   }

//   return historicalData.reverse();
// }

// /**
//  * Updates a balance snapshot based on transaction details
//  * @param snapshot - The current balance snapshot
//  * @param type - The transaction type
//  * @param currency - The transaction currency
//  * @param targetCurrency - The target currency for transfers
//  * @param amount - The transaction amount
//  */
// function updateBalanceSnapshot(
//   snapshot: Record<CurrencyCode, number>,
//   type: TransactionType,
//   currency: CurrencyCode,
//   targetCurrency: CurrencyCode | undefined,
//   amount: number
// ): void {
//   switch (type) {
//     case "deposit":
//       snapshot[currency] -= amount;
//       break;
//     case "withdrawal":
//       snapshot[currency] += amount;
//       break;
//     case "transfer":
//       if (targetCurrency && CurrencyCodes.includes(targetCurrency)) {
//         snapshot[currency] += amount;
//         snapshot[targetCurrency] -= amount;
//       }
//       break;
//     case "refund":
//       snapshot[currency] += amount;
//       break;
//     case "purchase":
//       snapshot[currency] += amount;
//       break;
//   }
// }