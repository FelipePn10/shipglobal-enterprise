import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { balances, transactions, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { CurrencyCode } from "@/types/balance";
import { TransactionCollection } from "@/lib/mongo/collections/transactions";

interface WithdrawalRequest {
  currency: CurrencyCode;
  amount: number;
  payoutId: string;
  targetAccount?: {
    bankCode: string;
    accountNumber: string;
    accountType: string;
  };
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

    // Get user info from MySQL
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { currency, amount, payoutId, targetAccount } = body as WithdrawalRequest;

    // Validation
    if (!["USD", "EUR", "CNY", "JPY"].includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (typeof payoutId !== "string" || !payoutId.trim()) {
      return NextResponse.json({ error: "Invalid payout ID" }, { status: 400 });
    }

    // Process in transaction
    const mysqlResults = await db.transaction(async (tx) => {
      // Check balance
      const existingBalance = await tx
        .select({ amount: balances.amount })
        .from(balances)
        .where(and(eq(balances.userId, userId), eq(balances.currency, currency)))
        .limit(1);

      if (!existingBalance.length || parseFloat(existingBalance[0].amount) < amount) {
        throw new Error("Insufficient balance");
      }

      // Update balance
      await tx
        .update(balances)
        .set({
          amount: (parseFloat(existingBalance[0].amount) - amount).toFixed(2),
          lastUpdated: new Date(),
        })
        .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));

      // Get updated balance
      const [updatedBalance] = await tx
        .select()
        .from(balances)
        .where(and(eq(balances.userId, userId), eq(balances.currency, currency)));

      if (!updatedBalance) {
        throw new Error("Failed to retrieve updated balance");
      }

      // Create transaction in MySQL
      const transactionIdArray = await tx
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
      
      const [newTransaction] = await tx
        .select()
        .from(transactions)
        .where(eq(transactions.id, transactionIdArray[0].id));

      return { updatedBalance, newTransaction };
    });

    // Create transaction in MongoDB
    const mongoTransaction = await TransactionCollection.create({
      userId,
      type: "withdrawal",
      amount,
      currency,
      status: "pending",
      payoutId,
      description: `Withdrawal of ${amount.toFixed(2)} ${currency} (Payout ID: ${payoutId})`,
      metadata: {
        mysqlTransactionId: mysqlResults.newTransaction.id,
        mysqlUserId: userId,
        userEmail: user[0].email,
        userName: `${user[0].firstName} ${user[0].lastName}`,
        targetAccount,
        ipAddress: req.headers.get('x-forwarded-for') || '',
        userAgent: req.headers.get('user-agent') || ''
      }
    });

    return NextResponse.json({
      balance: {
        amount: parseFloat(mysqlResults.updatedBalance.amount),
        currency: mysqlResults.updatedBalance.currency as CurrencyCode,
        lastUpdated: mysqlResults.updatedBalance.lastUpdated.toISOString(),
      },
      transaction: {
        id: `tx-${mysqlResults.newTransaction.id}`,
        mongoId: mongoTransaction._id.toString(),
        type: mysqlResults.newTransaction.type,
        amount: parseFloat(mysqlResults.newTransaction.amount),
        currency: mysqlResults.newTransaction.currency as CurrencyCode,
        date: mysqlResults.newTransaction.date.toISOString(),
        status: mysqlResults.newTransaction.status,
        description: mysqlResults.newTransaction.description,
      },
    });
  } catch (error) {
    console.error("Withdrawal Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process withdrawal";
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}