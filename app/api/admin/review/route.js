import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Review from "@/model/review";

// GET: Fetch all categories
export async function GET() {
  await dbConnect();

  try {
    const review = await Review.find({})
    .populate("listing_id")
    .populate("user_id")
    .sort({ createdAt: -1 });
     console.log("review*****" , review)
    return NextResponse.json(review);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
