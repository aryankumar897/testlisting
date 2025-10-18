import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Review from "@/model/review";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  console.log("body", body);

  const { rating, message, listing_id } = body;

  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    const user_id = session?.user?._id;
    if (!session) {
      return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ err: "Invalid rating" }, { status: 400 });
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { err: "Review message is required" },
        { status: 400 }
      );
    }

    const savedReview = await Review.create({
      rating,
      review: message,
      user_id,
      listing_id,
    });

    console.log("savedReview", savedReview);
    return NextResponse.json(savedReview);
  } catch (err) {
    console.log("savedReview  err)", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
