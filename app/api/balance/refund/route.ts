// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { balances, transactions } from "@/lib/schema";
// import { eq, and } from "drizzle-orm";
// import { CurrencyCode } from "@/types/balance";
// import { TransactionCollection } from "@/lib/mongo/collections/transactions";

// interface RefundRequest {
//   currency: CurrencyCode;
//   amount: number;
//   paymentIntentId: string;
//   refundId: string;
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user || session.user.type !== "user") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = parseInt(session.user.id);
//     if (isNaN(userId)) {
//       return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
//     }

//     const body = await req.json();
//     const { currency, amount, paymentIntentId, refundId } = body as RefundRequest;

//     // Validation
//     if (!["USD", "EUR", "CNY", "JPY"].includes(currency)) {
//       return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
//     }

//     if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
//     }

//     if (typeof paymentIntentId !== "string" || !paymentIntentId.trim()) {
//       return NextResponse.json({ error: "Invalid paymentIntentId" }, { status: 400 });
//     }

//     if (typeof refundId !== "string" || !refundId.trim()) {
//       return NextResponse.json({ error: "Invalid refundId" }, { status: 400 });
//     }

//     // Process in transaction
//     const mysqlResults = await db.transaction(async (tx) => {
//       // Check and update balance
//       const existingBalance = await tx
//         .select({ amount: balances.amount })
//         .from(balances)
//         .where(and(eq(balances.userId, userId), eq(balances.currency, currency)))
//         .limit(1);

//       let updatedBalance: { amount: string; lastUpdated: Date };
//       if (existingBalance.length > 0) {
//         const newAmount = (Number(existingBalance[0].amount) - amount).toFixed(2);
//         if (Number(newAmount) < 0) {
//           throw new Error("Insufficient balance for refund");
//         }

//         await tx
//           .update(balances)
//           .set({
//             amount: newAmount,
//             lastUpdated: new Date(),
//           })
//           .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));

//         [updatedBalance] = (await tx
//           .select()
//           .from(balances)
//           .where(and(eq(balances.userId, userId), eq(balances.currency, currency)))) as {
//             amount: string;
//             lastUpdated: Date;
//           }[];
//       } else {
//         const insertedId = await tx
//           .insert(balances)
//           .values({
//             userId,
//             currency,
//             amount: (-amount).toFixed(2),
//             lastUpdated: new Date(),
//           })
//           .$returningId();
        
//         [updatedBalance] = await tx
//           .select()
//           .from(balances)
//           .where(eq(balances.id, Number(insertedId[0].id)));
//       }

//       // Create transaction in MySQL
//       const transactionIdResult = await tx
//         .insert(transactions)
//         .values({
//           userId,
//           type: "refund",
//           amount: amount.toFixed(2),
//           currency,
//           date: new Date(),
//           status: "completed",
//           description: `Refund of ${amount.toFixed(2)} ${currency} (Refund ID: ${refundId})`,
//           paymentIntentId,
//         })
//         .$returningId();
      
//       const [newTransaction] = await tx
//         .select()
//         .from(transactions)
//         .where(eq(transactions.id, transactionIdResult[0].id));

//       return { updatedBalance, newTransaction };
//     });

//     // Create transaction in MongoDB
//     const mongoTransaction = await TransactionCollection.create({
//       userId,
//       type: "refund",
//       amount,
//       currency,
//       status: "completed",
//       paymentIntentId,
//       refundId,
//       description: `Refund of ${amount.toFixed(2)} ${currency} (Refund ID: ${refundId})`,
//       metadata: {
//         mysqlTransactionId: mysqlResults.newTransaction.id,
//         originalPaymentIntentId: paymentIntentId,
//         ipAddress: req.headers.get('x-forwarded-for') || '',
//         userAgent: req.headers.get('user-agent') || ''
//       }
//     });

//     return NextResponse.json({
//       balance: {
//         amount: parseFloat(mysqlResults.updatedBalance.amount),
//         currency,
//         lastUpdated: mysqlResults.updatedBalance.lastUpdated.toISOString(),
//       },
//       transaction: {
//         id: `tx-${mysqlResults.newTransaction.id}`,
//         mongoId: mongoTransaction._id.toString(),
//         type: "refund",
//         amount: parseFloat(mysqlResults.newTransaction.amount),
//         currency: mysqlResults.newTransaction.currency as CurrencyCode,
//         date: mysqlResults.newTransaction.date.toISOString(),
//         status: mysqlResults.newTransaction.status,
//         description: mysqlResults.newTransaction.description,
//         paymentIntentId: mysqlResults.newTransaction.paymentIntentId,
//       },
//     });
//   } catch (error) {
//     console.error("Refund Error:", error);
//     const errorMessage = error instanceof Error ? error.message : "Failed to process refund";
//     return NextResponse.json(
//       { error: errorMessage, details: error instanceof Error ? error.stack : undefined },
//       { status: 500 }
//     );
//   }
// }