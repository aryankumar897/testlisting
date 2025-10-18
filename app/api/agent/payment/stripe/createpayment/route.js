import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

import Stripe from "stripe";

const stripeInstance = new Stripe(
  "sk_test_51K5nvYSGgs9C5RdZpIIhINkUXAcMb46wbwGbJiGGWlt2VXjXhjP6wQerucW9lc3AUDCoMZ3ArV3zLIMxCQRSI24100pNDDDSew"
);

import Package from "@/model/package";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { id } = body;
  try {
    const session = await getServerSession(authOptions);
    console.log("session", session);

    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ _id: session?.user?._id });

    // If the user is not found, return an error response
    if (!user) {
      return NextResponse.json({ err: "user not found" }, { status: 500 });
    }
    const pkg = await Package.findOne({ _id: id }).sort({
      createdAt: -1,
    });

    if (!pkg) {
      return NextResponse.json({ err: "pkg not found" }, { status: 404 });
    }

    // Create a new Stripe checkout session to initiate the payment process
    const sessions = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: pkg.name,
            },
            // Round the amount to the nearest integer to avoid floating point issues
            unit_amount: Math.round(pkg.price * 100), // Multiply by 100 and round to nearest integer
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:3000/dashboard/agent/stripe/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/dashboard/agent/stripe/canceled",
      customer_email: user?.email,
      metadata: {
        pkgId: pkg._id.toString(),
      },
    });

    console.log("stripe url", sessions);
    return NextResponse.json({ id: sessions.url });
  } catch (err) {
    console.log("errorrrr", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
