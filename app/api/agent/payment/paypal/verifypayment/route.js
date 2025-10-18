// Import necessary modules and functions

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Order from "@/model/order";
import Subscription from "@/model/subscription";
import paypal from "@paypal/checkout-server-sdk"; // Import PayPal SDK for handling PayPal transactions
// Create PayPal environment for Sandbox (test environment)
let environment = new paypal.core.SandboxEnvironment(
  "AceW9nJb3-RlOq1F9qpl40eCvABcWpTtxCO5rTu47RpdFOoAiQGJSRRKqAPVodkMWTUbVCAyNpBRaZDL", // PayPal client ID (Sandbox)
  "EHGdvjb7JZ2dnhivVEyI_LAJPEWLxOzkxcFkcivqc_HH4nnqUbcYscfqVsOLwxbqiFY7OqHMJkluJoT0" // PayPal client secret (Sandbox)
);

// Create a PayPal HTTP client to execute requests
let client = new paypal.core.PayPalHttpClient(environment);

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

  const { token } = await req.json();

  console.log("sessionid ", token);

  try {
    const session = await getServerSession(authOptions);

    // Create a PayPal OrdersCaptureRequest object using the PayPal order ID from the context
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({}); // Empty body as no additional data is needed for the capture request

    // Execute the PayPal request to capture the payment
    const response = await client.execute(request);
    console.log("response payapal", response); // Log the response for debugging

    console.log(JSON.stringify({ response }, null, 4));

    // Extract the transaction reference ID from the PayPal response
    const pkgId = response?.result?.purchase_units[0].reference_id;

    // const value = stripesession.amount_total;
    //  const currency = stripesession.currency;
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
    if (response?.result?.status === "COMPLETED") {
      const orderData = {
        order_id: response?.result?.id,
        transaction_id: response?.result?.id,
        user_id: session.user._id,
        package_id: pkg._id,
        payment_method: "paypal",
        payment_status: "pending",
        base_amount: pkg.price,
        base_currency:  "INR",
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
