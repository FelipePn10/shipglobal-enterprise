import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
  });

export async function POST(req: Request) {
  try {
    const { paymentIntentId, amount } = await req.json();
    if (!paymentIntentId) {
      return NextResponse.json({ error: "Missing paymentIntentId" }, { status: 400 });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return NextResponse.json({ refundId: refund.id });
  } catch (error: any) {
    console.error("Refund Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create refund" },
      { status: 500 }
    );
  }
}