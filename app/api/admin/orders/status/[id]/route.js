import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/model/order";

// GET: Fetch all categories
export async function GET(req , context) {
  await dbConnect();


   const {id}=await context?.params
  try {
    const order = await Order.findOne({_id:id})
      .populate("user_id")
      .populate("package_id")
      
      .sort({ createdAt: -1 });

    console.log("order id ********", order);

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
