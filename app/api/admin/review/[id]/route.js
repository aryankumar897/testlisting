import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Review from "@/model/review";

// PUT: Update a review (for approval status and other fields)
export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } =await params;

    if (!id) {
      return NextResponse.json({ err: "Review ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { rating, review, is_approved } = body;

    // Find the review first
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      return NextResponse.json({ err: "Review not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData = {};
    
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { err: "Rating must be between 1 and 5" },
          { status: 400 }
        );
      }
      updateData.rating = rating;
    }

    if (review !== undefined) {
      if (review.trim().length === 0) {
        return NextResponse.json(
          { err: "Review text cannot be empty" },
          { status: 400 }
        );
      }
      updateData.review = review;
    }

    if (is_approved !== undefined) {
      updateData.is_approved = is_approved;
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
  //  .populate("listing_id").populate("user_id");


     console.log("updatedReview sucessfully " ,updatedReview)
    return NextResponse.json(updatedReview);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const { id } =await  params;

    if (!id) {
      return NextResponse.json({ err: "Review ID is required" }, { status: 400 });
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ err: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Review deleted successfully"},
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}