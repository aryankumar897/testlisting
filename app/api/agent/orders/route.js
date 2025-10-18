import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/model/order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

// GET: Fetch only pending orders
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

    // Find all orders for the user
    const orders = await Order.find({ user_id: userId })
      .populate("package_id")
      .populate("user_id")
      .lean();

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }
 
      console.log("orders get uset", orders)

    return NextResponse.json(orders);
    
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
