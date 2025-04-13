import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { balances, transactions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { CurrencyCode } from "@/types/balance";

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

    // Check existing balance
    const existingBalance = await db
      .select({ amount: balances.amount })
      .from(balances)
      .where(and(eq(balances.userId, userId), eq(balances.currency, currency)))
      .limit(1);

    let updatedBalance: { amount: string; lastUpdated: Date };
    if (existingBalance.length > 0) {
      // For MySQL with Drizzle, we need to perform update then select
      await db
        .update(balances)
        .set({
          amount: (Number(existingBalance[0].amount) - amount).toFixed(2),
          lastUpdated: new Date(),
        })
        .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));
      
      // Get the updated balance
      [updatedBalance] = (await db
        .select()
        .from(balances)
        .where(and(eq(balances.userId, userId), eq(balances.currency, currency)))) as { amount: string; lastUpdated: Date }[];
    } else {
      // For inserts in MySQL with Drizzle, use $returningId
      const insertedId = await db
        .insert(balances)
        .values({
          userId,
          currency,
          amount: (-amount).toFixed(2),
          lastUpdated: new Date(),
        })
        .$returningId();
      
      // Extract the inserted ID
      const balanceId = Array.isArray(insertedId) ? insertedId[0] : insertedId;

      // Get the newly inserted balance
      [updatedBalance] = await db
        .select()
        .from(balances)
        .where(eq(balances.id, Number(balanceId)));
    }

    // Record transaction using $returningId
    const transactionIdResult = await db
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
    
    const transactionId = Array.isArray(transactionIdResult) ? transactionIdResult[0] : transactionIdResult as number;

    // Get the complete transaction record
    const [newTransaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, typeof transactionId === "number" ? transactionId : transactionId.id));

    return NextResponse.json({
      balance: {
        amount: parseFloat(updatedBalance.amount as string),
        lastUpdated: updatedBalance.lastUpdated.toISOString(),
      },
      transaction: {
        id: `tx-${newTransaction.id}`,
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount as string),
        currency: newTransaction.currency as CurrencyCode,
        date: (newTransaction.date as Date).toISOString(),
        status: newTransaction.status,
        description: newTransaction.description,
        paymentIntentId: newTransaction.paymentIntentId,
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