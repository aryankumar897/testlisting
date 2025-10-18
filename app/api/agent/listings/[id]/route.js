import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Listing from "@/model/listing";

// PUT: Update a listing by ID
export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  try {
    const { _id, ...updateBody } = body;

    const updatedListing = await Listing.findByIdAndUpdate(
      context.params.id, // listing ID from route
      updateBody,
      { new: true }
    )
      .populate("category_id", "name")
      .populate("location_id", "name");

    return NextResponse.json(updatedListing);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE: Delete a listing by ID
export async function DELETE(req, context) {
  await dbConnect();
  const { id } = await context.params;
  try {
    const deletedListing = await Listing.findByIdAndDelete(id);
    return NextResponse.json(deletedListing);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// GET: Fetch a single listing by ID (with category & location populated)
export async function GET(req, context) {
  await dbConnect();

  try {
    const listing = await Listing.findById(context.params.id)
      .populate("category_id", "name")
      .populate("location_id", "name");

    if (!listing) {
      return NextResponse.json({ err: "Listing not found" }, { status: 404 });
    }

     console.log("get my single listing", listing)

    return NextResponse.json(listing);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
