import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Subscription from "@/model/subscription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

// GET: Fetch active subscriptions
export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  console.log("User session:", session);

  if (!session?.user?._id) {
    console.log("Unauthorized access attempt ❌");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user?._id;

    // Find active subscriptions for the user
    const subscriptions = await Subscription.find({ 
      user_id: userId,
      status: true // Only active subscriptions
    })
      .populate("package_id")
      .populate("user_id")
      .populate("order_id")
      .lean();

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: "No active subscriptions found" }, { status: 404 });
    }

    console.log("Active subscriptions get user", subscriptions);

    return NextResponse.json(subscriptions);
    
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}