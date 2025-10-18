// app/api/admin/product-gallery/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import ListingImageGallery from "@/model/listingimagegallery"


export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    await ListingImageGallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}