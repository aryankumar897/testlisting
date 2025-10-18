import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Package from "@/model/package";
import Razorpay from "razorpay";
var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { id } = body;
  try {
    const packagedata = await Package.findOne({ _id: id }).sort({
      createdAt: -1,
    });

    console.log("packagedata", packagedata);

    const options = {
      amount: packagedata.price * 100, //amount in smallest currency unit
      currency: "INR",
      receipt: "donation_receipt",
      notes: {
        packageId: packagedata._id,
      },
    };

    const order = await razorpay.orders.create(options);

    console.log("order", order);

    return NextResponse.json(order);
  } catch (err) {
    console.log("errorrrr", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
