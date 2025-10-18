import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Order from "@/model/order";

export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = await params;

  try {
    const { payment_status } = await req.json();

    console.log("payment methid", {
      payment_status,
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        payment_status,
      },

      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({
        success: false,
        message: "order not  found",
      });
    }

    console.log("updatedOrder", updatedOrder);
    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
