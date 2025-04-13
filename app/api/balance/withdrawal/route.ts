import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { balances, transactions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { CurrencyCode } from "@/types/balance";

interface WithdrawalRequest {
  currency: CurrencyCode;
  amount: number;
  payoutId: string;
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
    const { currency, amount, payoutId } = body as WithdrawalRequest;

    // Validate currency
    if (!["USD", "EUR", "CNY", "JPY"].includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Validate payout ID
    if (typeof payoutId !== "string" || !payoutId.trim()) {
      return NextResponse.json({ error: "Invalid payout ID" }, { status: 400 });
    }

    // Check balance
    const existingBalance = await db
      .select({ amount: balances.amount })
      .from(balances)
      .where(and(eq(balances.userId, userId), eq(balances.currency, currency)))
      .limit(1);

    if (!existingBalance.length || parseFloat(existingBalance[0].amount as string) < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Update balance (MySQL doesn't support returning, so we need to select after update)
    await db
      .update(balances)
      .set({
        amount: (parseFloat(existingBalance[0].amount as string) - amount).toFixed(2),
        lastUpdated: new Date(),
      })
      .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));

    // Get updated balance
    const [updatedBalance] = await db
      .select()
      .from(balances)
      .where(and(eq(balances.userId, userId), eq(balances.currency, currency))) as { amount: string; lastUpdated: Date }[];

    // Record transaction using $returningId for MySQL
    const transactionId = await db
      .insert(transactions)
      .values({
        userId,
        type: "withdrawal",
        amount: amount.toFixed(2),
        currency,
        date: new Date(),
        status: "pending",
        description: `Withdrawal of ${amount.toFixed(2)} ${currency} (Payout ID: ${payoutId})`,
      })
      .$returningId();

    // Get the complete transaction record
    const [newTransaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, Number(transactionId[0])));

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
      },
    });
  } catch (error) {
    console.error("Withdrawal Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process withdrawal";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}