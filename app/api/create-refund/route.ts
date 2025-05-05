// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";

// // Validate Stripe secret key at startup
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// if (!STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY is not defined");
// }

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
//   apiVersion: "2025-03-31.basil",
// });

// // Define request body interface
// interface RequestBody {
//   paymentIntentId: string;
//   amount?: number;
// }

// /**
//  * Creates a Stripe refund for a given payment intent
//  * @route POST /api/create-refund
//  * @param req - The incoming request with paymentIntentId and optional amount
//  * @returns JSON response with refund ID or error message
//  */
// export async function POST(req: Request) {
//   try {
//     // Authenticate user (consistent with /api/stripe-account)
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user || session.user.type !== "user") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Parse and validate request body
//     const body: RequestBody = await req.json();
//     const { paymentIntentId, amount } = body;

//     if (!paymentIntentId || typeof paymentIntentId !== "string" || !paymentIntentId.startsWith("pi_")) {
//       return NextResponse.json(
//         { error: "Invalid or missing paymentIntentId" },
//         { status: 400 }
//       );
//     }

//     if (amount !== undefined) {
//       if (typeof amount !== "number" || amount <= 0 || isNaN(amount)) {
//         return NextResponse.json(
//           { error: "Amount must be a positive number" },
//           { status: 400 }
//         );
//       }
//     }

//     // Create refund
//     const refund = await stripe.refunds.create({
//       payment_intent: paymentIntentId,
//       amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
//     });

//     return NextResponse.json({ refundId: refund.id });
//   } catch (error: unknown) {
//     console.error("Refund Error:", { error, paymentIntentId: (await req.json())?.paymentIntentId });
//     const message =
//       error instanceof Stripe.errors.StripeError
//         ? error.message
//         : "Failed to create refund";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }