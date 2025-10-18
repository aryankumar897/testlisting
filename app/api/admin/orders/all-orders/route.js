import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/model/order";

// GET: Fetch all categories
export async function GET() {
  await dbConnect();

  try {
    const order = await Order.find({})
      .populate("user_id")
      .populate("package_id")
      
      .sort({ createdAt: -1 });

    console.log("order********", order);

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
