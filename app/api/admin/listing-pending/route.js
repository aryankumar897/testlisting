import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Listing from "@/model/listing";


export async function GET() {
  await dbConnect();

  try {
    const listings = await Listing.find({
      is_approved: false,
    })
      .populate("category_id", "name")
      .populate("location_id", "name")
      .sort({ createdAt: -1 });
    console.log("listing getting", listings);
    return NextResponse.json(listings);
  } catch (err) {
    console.log("getting listing", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
