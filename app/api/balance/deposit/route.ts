import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { balances, transactions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { CurrencyCode, PaymentCurrency } from "@/types/balance";

interface DepositRequest {
  currency: CurrencyCode;
  amount: number;
  paymentCurrency: PaymentCurrency;
  paymentIntentId: string;
}

interface BalanceRecord {
  id: number;
  userId: number;
  currency: CurrencyCode;
  amount: string;
  lastUpdated: Date;
}

interface TransactionRecord {
  id: number;
  type: string;
  amount: string;
  currency: CurrencyCode;
  date: Date;
  status: string;
  description: string | null;
  paymentIntentId: string | null;
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
    const { currency, amount, paymentCurrency, paymentIntentId } = body as DepositRequest;

    // Validate currency
    if (!["USD", "EUR", "CNY", "JPY"].includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Validate payment currency
    if (!["USD", "EUR", "CNY", "JPY", "BRL"].includes(paymentCurrency)) {
      return NextResponse.json({ error: "Invalid payment currency" }, { status: 400 });
    }

    // Validate payment intent ID
    if (typeof paymentIntentId !== "string" || !paymentIntentId.trim()) {
      return NextResponse.json({ error: "Invalid payment intent ID" }, { status: 400 });
    }

    // Update or insert balance
    const existingBalance = await db
      .select()
      .from(balances)
      .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));

    let updatedBalance: BalanceRecord;
    if (existingBalance.length > 0) {
      // For updates in MySQL with Drizzle, we need to select after update
      await db
        .update(balances)
        .set({
          amount: (Number(existingBalance[0].amount) + amount).toFixed(2),
          lastUpdated: new Date(),
        })
        .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));
      
      // Get the updated balance
      const [balance] = await db
        .select()
        .from(balances)
        .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));
      
      if (!balance) {
        throw new Error("Failed to retrieve updated balance");
      }
      updatedBalance = {
        ...balance,
        currency: balance.currency as CurrencyCode,
      };
    } else {
      // For inserts in MySQL with Drizzle, use $returningId
      const insertedId = await db
        .insert(balances)
        .values({
          userId,
          currency,
          amount: amount.toFixed(2),
          lastUpdated: new Date(),
        })
        .$returningId();
      
      // Get the newly inserted balance
      const [balance] = await db
        .select()
        .from(balances)
        .where(eq(balances.id, insertedId[0].id));
      
      if (!balance) {
        throw new Error("Failed to retrieve newly created balance");
      }
      updatedBalance = {
        ...balance,
        currency: balance.currency as CurrencyCode,
      };
    }

    // Record transaction using $returningId
    const transactionIdArray = await db
      .insert(transactions)
      .values({
        userId,
        type: "deposit",
        amount: amount.toFixed(2),
        currency,
        date: new Date(),
        status: "completed",
        description: `Deposit of ${amount.toFixed(2)} ${currency}`,
        paymentIntentId,
      })
      .$returningId();
    
    const transactionId = transactionIdArray[0].id;

    // Get the complete transaction record
    const [newTransaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, transactionId));
    
    if (!newTransaction) {
      throw new Error("Failed to retrieve created transaction");
    }

    return NextResponse.json({
      balance: {
        amount: parseFloat(updatedBalance.amount),
        currency: updatedBalance.currency,
        lastUpdated: updatedBalance.lastUpdated.toISOString(),
      },
      transaction: {
        id: `tx-${newTransaction.id}`,
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        currency: newTransaction.currency,
        date: newTransaction.date.toISOString(),
        status: newTransaction.status,
        description: newTransaction.description,
        paymentIntentId: newTransaction.paymentIntentId,
      },
    });
  } catch (error) {
    console.error("Deposit Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process deposit";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}