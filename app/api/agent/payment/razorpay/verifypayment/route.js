
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Package from "@/model/package";
import Razorpay from "razorpay";
import Order from "@/model/order";
import Subscription from "@/model/subscription";

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { razorpay_payment_id } = body;

  const session = await getServerSession(authOptions);

  
  try {
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log("payment razorpay", payment);

    const value = payment.amount;
    const currencyCode = payment.currency;
    const PackageId = payment.notes.packageId;
    
    const pkg = await Package.findOne({ _id: PackageId }).sort({
      createdAt: -1,
    });

    if (!pkg) {
      return NextResponse.json(
        { message: "Package not found" },
        { status: 404 }
      );
    }

    if (payment && payment.status === "captured") {
      console.log("payment captured");

      const orderData = {
        order_id: payment.order_id,
        transaction_id: payment.id,
        user_id: session.user._id,
        package_id: pkg._id,
        payment_method: payment.wallet,
        payment_status: "pending",
        base_amount: value / 100,
        base_currency: currencyCode || "USD",
        purchase_date: new Date(),
      };

      const order = await Order.create(orderData);

      // Check for existing active subscription
      const existingSubscription = await Subscription.findOne({
        user_id: session.user._id,
        status: true
      });

      let remainingDays = 0;
      let baseDate = order.purchase_date;

      // If there's an existing subscription with remaining days, calculate them
      if (existingSubscription && existingSubscription.expire_date) {
        remainingDays = calculateDaysRemaining(existingSubscription.expire_date);
        
        // If there are remaining days, use the existing expire_date as base
        if (remainingDays > 0) {
          baseDate = new Date(existingSubscription.expire_date);
          console.log(`Found ${remainingDays} remaining days from previous subscription`);
        }
      }

      // Compute new expire_date
      const numberOfDays = typeof pkg.number_of_days === "number" ? pkg.number_of_days : null;
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



      
    }

    return NextResponse.json({ success: "payment success" }, { status: 200 });

  } catch (err) {
    console.log("payment error", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}