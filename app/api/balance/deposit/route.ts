// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { balances, transactions } from "@/lib/schema";
// import { eq, and } from "drizzle-orm";
// import { CurrencyCode, PaymentCurrency } from "@/types/balance";
// import { Transaction as MongoTransaction } from "@/lib/mongoModels";
// import clientPromise from "@/lib/mongo";

// interface DepositRequest {
//   currency: CurrencyCode;
//   amount: number;
//   paymentCurrency: PaymentCurrency;
//   paymentIntentId: string;
// }

// interface BalanceRecord {
//   id: number;
//   userId: number;
//   currency: CurrencyCode;
//   amount: string;
//   lastUpdated: Date;
// }

// export async function POST(req: Request) {
//   try {
//     // Authenticate user
//     const session = await getServerSession(authOptions);
//     if (!session?.user || session.user.type !== "user") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = parseInt(session.user.id);
//     if (isNaN(userId)) {
//       return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
//     }

//     // Parse and validate request body
//     const body = await req.json();
//     const { currency, amount, paymentCurrency, paymentIntentId } = body as DepositRequest;

//     if (!["USD", "EUR", "CNY", "JPY"].includes(currency)) {
//       return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
//     }

//     if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
//     }

//     if (!["USD", "EUR", "CNY", "JPY", "BRL"].includes(paymentCurrency)) {
//       return NextResponse.json({ error: "Invalid payment currency" }, { status: 400 });
//     }

//     if (typeof paymentIntentId !== "string" || !paymentIntentId.trim()) {
//       return NextResponse.json({ error: "Invalid payment intent ID" }, { status: 400 });
//     }

//     // Start MySQL transaction
//     const mysqlResults = await db.transaction(async (tx) => {
//       // Update or insert balance
//       const existingBalance = await tx
//         .select()
//         .from(balances)
//         .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));

//       let updatedBalance: BalanceRecord;
//       if (existingBalance.length > 0) {
//         await tx
//           .update(balances)
//           .set({
//             amount: (Number(existingBalance[0].amount) + amount).toFixed(2),
//             lastUpdated: new Date(),
//           })
//           .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));

//         const [balance] = await tx
//           .select()
//           .from(balances)
//           .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));

//         if (!balance) throw new Error("Failed to retrieve updated balance");
//         updatedBalance = {
//           ...balance,
//           currency: balance.currency as CurrencyCode,
//         };
//       } else {
//         const insertedId = await tx
//           .insert(balances)
//           .values({
//             userId,
//             currency,
//             amount: amount.toFixed(2),
//             lastUpdated: new Date(),
//           })
//           .$returningId();

//         const [balance] = await tx
//           .select()
//           .from(balances)
//           .where(eq(balances.id, insertedId[0].id));

//         if (!balance) throw new Error("Failed to retrieve newly created balance");
//         updatedBalance = {
//           ...balance,
//           currency: balance.currency as CurrencyCode,
//         };
//       }

//       // Record transaction in MySQL
//       const transactionIdArray = await tx
//         .insert(transactions)
//         .values({
//           userId,
//           type: "deposit",
//           amount: amount.toFixed(2),
//           currency,
//           date: new Date(),
//           status: "completed",
//           description: `Deposit of ${amount.toFixed(2)} ${currency}`,
//           paymentIntentId,
//         })
//         .$returningId();

//       const transactionId = transactionIdArray[0].id;

//       const [newTransaction] = await tx
//         .select()
//         .from(transactions)
//         .where(eq(transactions.id, transactionId));

//       if (!newTransaction) throw new Error("Failed to retrieve created transaction");

//       return { updatedBalance, newTransaction };
//     });

//     // Connect to MongoDB
//     const mongoClient = await clientPromise;
//     const mongoDb = mongoClient.db();
//     const transactionsCollection = mongoDb.collection<MongoTransaction>("transactions");

//     // Record transaction in MongoDB
//     const mongoTransaction: MongoTransaction = {
//       userId,
//       type: "deposit",
//       amount,
//       currency,
//       status: "completed",
//       description: `Deposit of ${amount.toFixed(2)} ${currency}`,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       metadata: {
//         mysqlTransactionId: mysqlResults.newTransaction.id,
//         mysqlUserId: userId,
//         paymentIntentId,
//         paymentCurrency,
//         ipAddress: req.headers.get("x-forwarded-for") || "",
//         userAgent: req.headers.get("user-agent") || "",
//       },
//     };

//     const mongoResult = await transactionsCollection.insertOne(mongoTransaction);

//     return NextResponse.json({
//       balance: {
//         amount: parseFloat(mysqlResults.updatedBalance.amount),
//         currency: mysqlResults.updatedBalance.currency,
//         lastUpdated: mysqlResults.updatedBalance.lastUpdated.toISOString(),
//       },
//       transaction: {
//         id: `tx-${mysqlResults.newTransaction.id}`,
//         mongoId: mongoResult.insertedId.toString(),
//         type: mysqlResults.newTransaction.type,
//         amount: parseFloat(mysqlResults.newTransaction.amount),
//         currency: mysqlResults.newTransaction.currency,
//         date: mysqlResults.newTransaction.date.toISOString(),
//         status: mysqlResults.newTransaction.status,
//         description: mysqlResults.newTransaction.description,
//         paymentIntentId: mysqlResults.newTransaction.paymentIntentId,
//       },
//     });
//   } catch (error) {
//     console.error("Deposit Error:", {
//       error,
//       userId: parseInt((await getServerSession(authOptions))?.user?.id || "0", 10) || 0,
//     });
//     const errorMessage = error instanceof Error ? error.message : "Failed to process deposit";
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }