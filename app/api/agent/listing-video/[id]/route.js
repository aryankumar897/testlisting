// app/api/admin/product-gallery/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import ListingVideoGallery from "@/model/listingvideogallery";

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    await ListingVideoGallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
