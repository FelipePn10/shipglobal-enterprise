import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

// Validate Stripe secret key at startup
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

// Define request body interface
interface RequestBody {
  stripeAccountId: string;
}

/**
 * Updates the user's Stripe Connect account ID
 * @route POST /api/stripe-account
 * @param req - The incoming request
 * @returns JSON response with success status or error message
 */
export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.type !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Parse and validate request body
    const body: RequestBody = await req.json();
    const { stripeAccountId } = body;

    if (
      !stripeAccountId ||
      typeof stripeAccountId !== "string" ||
      !stripeAccountId.startsWith("acct_")
    ) {
      return NextResponse.json(
        { error: "Invalid Stripe Connect account ID" },
        { status: 400 }
      );
    }

    // Verify Stripe account
    try {
      await stripe.accounts.retrieve(stripeAccountId);
    } catch (stripeError) {
      console.error("Stripe account verification failed:", stripeError);
      const message =
        stripeError instanceof Stripe.errors.StripeError
          ? stripeError.message
          : "Invalid or inaccessible Stripe Connect account";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const updateResult = await db
      .update(users)
      .set({ stripeAccountId })
      .where(eq(users.id, userId));

    // For MySQL, use affectedRows to check if the update affected any rows
    if (updateResult[0].affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or no changes made" },
        { status: 404 }
      );
    }

    console.log(`Successfully updated Stripe account for user ${userId}`);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Stripe Account Update Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update Stripe account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}