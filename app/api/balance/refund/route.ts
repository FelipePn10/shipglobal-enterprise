import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { balances, transactions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { CurrencyCode } from "@/types/balance";

import { Transaction as MongoTransaction } from "@/lib/mongoModels";
import clientPromise from "@/lib/mongo";

interface RefundRequest {
  currency: CurrencyCode;
  amount: number;
  paymentIntentId: string;
  refundId: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.type !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();
    const { currency, amount, paymentIntentId, refundId } = body as RefundRequest;

    // Validate currency
    if (!["USD", "EUR", "CNY", "JPY"].includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Validate payment IDs
    if (typeof paymentIntentId !== "string" || !paymentIntentId.trim()) {
      return NextResponse.json({ error: "Invalid paymentIntentId" }, { status: 400 });
    }
    if (typeof refundId !== "string" || !refundId.trim()) {
      return NextResponse.json({ error: "Invalid refundId" }, { status: 400 });
    }

    // Connect to MongoDB
    const mongoClient = await clientPromise;
    const mongoDb = mongoClient.db();
    const transactionsCollection = mongoDb.collection<MongoTransaction>("transactions");

    // Start transaction (MySQL only)
    const mysqlResults = await db.transaction(async (tx) => {
      // Check existing balance
      const existingBalance = await tx
        .select({ amount: balances.amount })
        .from(balances)
        .where(and(eq(balances.userId, userId), eq(balances.currency, currency)))
        .limit(1);

      let updatedBalance: { amount: string; lastUpdated: Date };
      if (existingBalance.length > 0) {
        await tx
          .update(balances)
          .set({
            amount: (Number(existingBalance[0].amount) - amount).toFixed(2),
            lastUpdated: new Date(),
          })
          .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));
        
        [updatedBalance] = (await tx
          .select()
          .from(balances)
          .where(and(eq(balances.userId, userId), eq(balances.currency, currency)))) as {
            amount: string;
            lastUpdated: Date;
          }[];
      } else {
        const insertedId = await tx
          .insert(balances)
          .values({
            userId,
            currency,
            amount: (-amount).toFixed(2),
            lastUpdated: new Date(),
          })
          .$returningId();
        
        [updatedBalance] = await tx
          .select()
          .from(balances)
          .where(eq(balances.id, Number(insertedId[0].id)));
      }

      // Record transaction in MySQL
      const transactionIdResult = await tx
        .insert(transactions)
        .values({
          userId,
          type: "refund",
          amount: amount.toFixed(2),
          currency,
          date: new Date(),
          status: "completed",
          description: `Refund of ${amount.toFixed(2)} ${currency} (Refund ID: ${refundId})`,
          paymentIntentId,
        })
        .$returningId();
      
      const transactionId = transactionIdResult[0].id;

      const [newTransaction] = await tx
        .select()
        .from(transactions)
        .where(eq(transactions.id, transactionId));

      return { updatedBalance, newTransaction };
    });

    // Record transaction in MongoDB
    const mongoTransaction: MongoTransaction = {
      userId,
      type: "refund",
      amount,
      currency,
      status: "completed",
      paymentIntentId,
      refundId,
      description: `Refund of ${amount.toFixed(2)} ${currency} (Refund ID: ${refundId})`,
      metadata: {
        mysqlTransactionId: mysqlResults.newTransaction.id,
        originalPaymentIntentId: paymentIntentId,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mongoResult = await transactionsCollection.insertOne(mongoTransaction);

    return NextResponse.json({
      balance: {
        amount: parseFloat(mysqlResults.updatedBalance.amount),
        lastUpdated: mysqlResults.updatedBalance.lastUpdated.toISOString(),
      },
      transaction: {
        id: `tx-${mysqlResults.newTransaction.id}`,
        mongoId: mongoResult.insertedId.toString(),
        type: mysqlResults.newTransaction.type,
        amount: parseFloat(mysqlResults.newTransaction.amount),
        currency: mysqlResults.newTransaction.currency,
        date: mysqlResults.newTransaction.date.toISOString(),
        status: mysqlResults.newTransaction.status,
        description: mysqlResults.newTransaction.description,
        paymentIntentId: mysqlResults.newTransaction.paymentIntentId,
      },
    });
  } catch (error) {
    console.error("Refund Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process refund";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}