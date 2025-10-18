import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Order from "@/model/order";
import Subscription from "@/model/subscription";
import Package from "@/model/package";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { packageId } = body;
  
  try {
    const session = await getServerSession(authOptions);
    console.log("session", session);

    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ _id: session?.user?._id });

    // If the user is not found, return an error response
    if (!user) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }

    // Find the package
    const pkg = await Package.findOne({ _id: packageId });
    
    if (!pkg) {
      return NextResponse.json({ err: "Package not found" }, { status: 404 });
    }

    // Check if package is actually free
    if (pkg.type !== "free") {
      return NextResponse.json({ err: "This is not a free package" }, { status: 400 });
    }

    // 🚨 CRITICAL CHECK: Check if user has EVER activated ANY free package before
    const existingFreeSubscription = await Subscription.aggregate([
      {
        $lookup: {
          from: "packages",
          localField: "package_id",
          foreignField: "_id",
          as: "package"
        }
      },
      {
        $unwind: "$package"
      },
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(session.user._id),
          "package.type": "free"
        }
      }
    ]);

    if (existingFreeSubscription.length > 0) {
      return NextResponse.json({ 
        err: "You have already used a free package. Free packages can only be activated once per user." 
      }, { status: 400 });
    }

    // Additional check: Simple find with populate (backup method)
    const existingFreeSubs = await Subscription.find({
      user_id: session.user._id
    }).populate('package_id');

    const hasFreePackage = existingFreeSubs.some(sub => 
      sub.package_id && sub.package_id.type === "free"
    );

    if (hasFreePackage) {
      return NextResponse.json({ 
        err: "You have already used a free package. Free packages can only be activated once per user." 
      }, { status: 400 });
    }

    // Check if user already has an active subscription for this SPECIFIC free package
    const existingSubscriptionForThisPackage = await Subscription.findOne({
      user_id: session.user._id,
      package_id: packageId,
      status: true
    });

    if (existingSubscriptionForThisPackage) {
      return NextResponse.json({ 
        err: "You already have an active subscription for this free package" 
      }, { status: 400 });
    }

    // Create order record for free package
    const order = new Order({
      order_id: `FREE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: session.user._id,
      package_id: packageId,
      payment_method: "free",
      payment_status: "completed",
      base_amount: 0,
      base_currency: "INR",
      purchase_date: new Date(),
    });

    await order.save();

    // Calculate expiration date based on package days
    const expireDate = pkg.number_of_days > 0 
      ? new Date(Date.now() + pkg.number_of_days * 24 * 60 * 60 * 1000)
      : null; // If number_of_days is 0, it's lifetime access

    // Create subscription
    const subscription = new Subscription({
      user_id: session.user._id,
      package_id: packageId,
      order_id: order._id,
      purchase_date: new Date(),
      expire_date: expireDate,
      status: true, // Active
    });

    await subscription.save();

    return NextResponse.json({
      success: true,
      message: "Free package activated successfully",
     
    });

  } catch (err) {
    console.log("error activating free package", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}