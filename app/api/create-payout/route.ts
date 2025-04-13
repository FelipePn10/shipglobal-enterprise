import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
  });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.type !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { amount, currency } = await req.json();

    if (!amount || amount <= 0 || !currency || !["usd", "eur", "cny", "jpy"].includes(currency.toLowerCase())) {
      return NextResponse.json({ error: "Invalid amount or currency" }, { status: 400 });
    }

    const user = await db
      .select({ stripeAccountId: users.stripeAccountId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length || !user[0].stripeAccountId) {
      return NextResponse.json(
        { error: "No Stripe Connect account linked. Please add it in your profile." },
        { status: 400 }
      );
    }

    const stripeAccountId = user[0].stripeAccountId;

    try {
      await stripe.accounts.retrieve(stripeAccountId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or inaccessible Stripe Connect account" },
        { status: 400 }
      );
    }

    const payout = await stripe.payouts.create(
      {
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        description: `Withdrawal for user ${userId}`,
        method: "standard",
      },
      { stripeAccount: stripeAccountId }
    );

    return NextResponse.json({ payoutId: payout.id, status: payout.status });
  } catch (error: any) {
    console.error("Payout Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payout" },
      { status: error.statusCode || 500 }
    );
  }
}