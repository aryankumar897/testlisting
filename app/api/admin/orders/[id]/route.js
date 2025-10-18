import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Order from "@/model/order";

export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context?.params;
  try {
    const deletedorders = await Order.findByIdAndDelete(id);

    console.log("deletedCategory", deletedorders);
    return NextResponse.json(deletedorders);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
