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
//   amount: number;
//   currency: string;
// }

// /**
//  * Creates a Stripe payment intent for processing a payment
//  * @route POST /api/create-payment-intent
//  * @param req - The incoming request with amount and currency
//  * @returns JSON response with client secret or error message
//  */
// export async function POST(req: Request) {
//   try {
//     // Authenticate user (consistent with /api/create-payout, /api/stripe-account)
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user || session.user.type !== "user") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Parse and validate request body
//     const body: RequestBody = await req.json();
//     const { amount, currency } = body;

//     if (
//       !amount ||
//       typeof amount !== "number" ||
//       amount <= 0 ||
//       isNaN(amount)
//     ) {
//       return NextResponse.json(
//         { error: "Amount must be a positive number" },
//         { status: 400 }
//       );
//     }

//     if (
//       !currency ||
//       typeof currency !== "string" ||
//       !["usd", "eur", "cny", "jpy"].includes(currency.toLowerCase())
//     ) {
//       return NextResponse.json(
//         { error: "Invalid currency. Must be USD, EUR, CNY, or JPY" },
//         { status: 400 }
//       );
//     }

//     // Create payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency: currency.toLowerCase(),
//       automatic_payment_methods: { enabled: true },
//     });

//     console.log(`Successfully created payment intent for amount ${amount} ${currency}: ${paymentIntent.id}`);
//     return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error: unknown) {
//     console.error("Payment Intent Error:", { error, requestBody: await req.json().catch(() => null) });
//     const message =
//       error instanceof Stripe.errors.StripeError
//         ? error.message
//         : "Failed to create payment intent";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }