import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

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
    const { stripeAccountId } = await req.json();

    if (!stripeAccountId || !stripeAccountId.startsWith("acct_")) {
      return NextResponse.json(
        { error: "Invalid Stripe Connect account ID" },
        { status: 400 }
      );
    }

    // Verify Stripe account
    try {
      await stripe.accounts.retrieve(stripeAccountId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or inaccessible Stripe Connect account" },
        { status: 400 }
      );
    }

    // Update user
    await db
      .update(users)
      .set({ stripeAccountId })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Stripe Account Update Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update Stripe account" },
      { status: 500 }
    );
  }
}