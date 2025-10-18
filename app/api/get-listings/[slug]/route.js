import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Listing from "@/model/listing";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { slug } =await context.params;

 console.log("gete listing aluf" , slug)

 
    if (!slug) {
      return NextResponse.json(
        { error: "Missing Listing slug" },
        { status: 400 }
      );
    }

    const listing = await Listing.findOne({ slug: slug.trim()})
    .populate("user_id")
      .populate("category_id")
      .populate("location_id")
      .lean();

    if (!listing) {
      return NextResponse.json({ error: "listing not found" }, { status: 404 });
    }

 console.log("single listings", listing)

    return NextResponse.json(listing);
  } catch (err) {
    
    console.log("Error in GET /listing", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
