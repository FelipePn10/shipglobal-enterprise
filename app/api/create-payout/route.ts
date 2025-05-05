// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { users } from "@/lib/schema";
// import { eq } from "drizzle-orm";

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
//  * Creates a Stripe payout for a user's connected account
//  * @route POST /api/create-payout
//  * @param req - The incoming request with amount and currency
//  * @returns JSON response with payout ID and status or error message
//  */
// export async function POST(req: Request) {
//   try {
//     // Authenticate user
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user || session.user.type !== "user") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = parseInt(session.user.id);
//     if (isNaN(userId) || userId <= 0) {
//       return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
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

//     // Fetch user's Stripe account ID
//     const user = await db
//       .select({ stripeAccountId: users.stripeAccountId })
//       .from(users)
//       .where(eq(users.id, userId))
//       .limit(1);

//     if (!user.length || !user[0].stripeAccountId) {
//       return NextResponse.json(
//         {
//           error: "No Stripe Connect account linked. Please add it in your profile.",
//         },
//         { status: 400 }
//       );
//     }

//     const stripeAccountId = user[0].stripeAccountId;

//     // Verify Stripe account
//     try {
//       await stripe.accounts.retrieve(stripeAccountId);
//     } catch (stripeError) {
//       console.error("Stripe account verification failed:", {
//         stripeError,
//         userId,
//         stripeAccountId,
//       });
//       const message =
//         stripeError instanceof Stripe.errors.StripeError
//           ? stripeError.message
//           : "Invalid or inaccessible Stripe Connect account";
//       return NextResponse.json({ error: message }, { status: 400 });
//     }

//     // Create payout
//     const payout = await stripe.payouts.create(
//       {
//         amount: Math.round(amount * 100), // Convert to cents
//         currency: currency.toLowerCase(),
//         description: `Withdrawal for user ${userId}`,
//         method: "standard",
//       },
//       { stripeAccount: stripeAccountId }
//     );

//     console.log(`Successfully created payout for user ${userId}: ${payout.id}`);
//     return NextResponse.json({ payoutId: payout.id, status: payout.status });
//   } catch (error: unknown) {
//     console.error("Payout Error:", { error, userId: parseInt((await getServerSession(authOptions))?.user.id || "unknown") });
//     const message =
//       error instanceof Stripe.errors.StripeError
//         ? error.message
//         : "Failed to create payout";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }