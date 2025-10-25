import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Review from "@/model/review";

export async function GET(req, context) {
  await dbConnect();

  const { id } = await context?.params;

  try {
    // Get only approved reviews for this listing
    const listingReview = await Review.find({
      listing_id: id,
      is_approved: true // Only get approved reviews
    })
      .populate("user_id") // Populate user data
      .sort({ createdAt: -1 });

 console.log("listingReview",listingReview)

    return NextResponse.json(listingReview);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}