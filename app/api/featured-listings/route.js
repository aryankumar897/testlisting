import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Listing from "@/model/listing";

export async function GET() {
  await dbConnect();

  try {
    const listings = await Listing.find({
      is_featured: true,
      // support boolean true OR string "true"
      $or: [{ status: true }, { status: "true" }],
      // tolerant checks for different possible field names / types used in schema
   
    })
      .populate("category_id", "name")
      .populate("location_id", "name")
      .sort({ createdAt: -1 });

    console.log("featured listings (home):", listings.length);
    return NextResponse.json(listings);
  } catch (err) {
    console.error("getting featured listings error", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
