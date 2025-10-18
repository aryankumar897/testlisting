import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Order from "@/model/order";
import Subscription from "@/model/subscription";

import Stripe from "stripe";

const stripeInstance = new Stripe(
  "sk_test_51K5nvYSGgs9C5RdZpIIhINkUXAcMb46wbwGbJiGGWlt2VXjXhjP6wQerucW9lc3AUDCoMZ3ArV3zLIMxCQRSI24100pNDDDSew"
);

import Package from "@/model/package";

function addDays(date, days) {
  if (days == null) return null;
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

function calculateDaysRemaining(expireDate) {
  if (!expireDate) return 0;
  const today = new Date();
  const expire = new Date(expireDate);
  const diffTime = expire - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export async function POST(req, context) {
  await dbConnect();

  const { sessionid } = await req.json();

  console.log("sessionid ", sessionid);

  try {
    const session = await getServerSession(authOptions);

    // Retrieve the Stripe session details using the session ID passed in the context
    const stripesession = await stripeInstance.checkout.sessions.retrieve(
      sessionid
    );

    console.log("stripesessions", stripesession);

    const pkgId = stripesession?.metadata?.pkgId;

    const value = stripesession.amount_total;
    const currency = stripesession.currency;
    const pkg = await Package.findOne({ _id: pkgId }).sort({
      createdAt: -1,
    });

    console.log("pkg", pkg);
    if (!pkg) {
      return NextResponse.json(
        { message: "Package not found" },
        { status: 404 }
      );
    }

    // Check if payment is successful
    if (stripesession && stripesession?.payment_status === "paid") {
      const orderData = {
        order_id: stripesession.payment_intent,
        transaction_id: stripesession.id,
        user_id: session.user._id,
        package_id: pkg._id,
        payment_method: "stripe",
        payment_status: "pending",
        base_amount: value / 100,
        base_currency: currency || "USD",
        purchase_date: new Date(),
      };

      const order = await Order.create(orderData);

      // Check for existing active subscription
      const existingSubscription = await Subscription.findOne({
        user_id: session.user._id,
        status: true,
      });

      let remainingDays = 0;
      let baseDate = order.purchase_date;

      // If there's an existing subscription with remaining days, calculate them
      if (existingSubscription && existingSubscription.expire_date) {
        remainingDays = calculateDaysRemaining(
          existingSubscription.expire_date
        );

        // If there are remaining days, use the existing expire_date as base
        if (remainingDays > 0) {
          baseDate = new Date(existingSubscription.expire_date);
          console.log(
            `Found ${remainingDays} remaining days from previous subscription`
          );
        }
      }

      // Compute new expire_date
      const numberOfDays =
        typeof pkg.number_of_days === "number" ? pkg.number_of_days : null;
      let expireDate = null;

      if (numberOfDays !== -1 && numberOfDays !== null) {
        // Add new package days to base date (either today or existing expire_date)
        expireDate = addDays(baseDate, numberOfDays);
        console.log(`New expire date calculated: ${expireDate}`);
      }

      // Update or create subscription
      const update = {
        package_id: order.package_id,
        order_id: order._id,
        purchase_date: order.purchase_date,
        expire_date: expireDate,
        status: true,
      };

      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      const subscription = await Subscription.findOneAndUpdate(
        { user_id: session.user._id },
        update,
        options
      );

      console.log("Order created:", order);
      console.log("Subscription updated:", subscription);
      console.log(`Remaining days added: ${remainingDays}`);

      console.log("success");

      return NextResponse.json(
        { success: "Payment successful" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { failed: "Payment failed, try again" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.log("payment error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
