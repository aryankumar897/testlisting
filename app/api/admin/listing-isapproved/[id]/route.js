import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Listing from "@/model/listing";
export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    // Accepts { is_approved: true/false } (or other fields you want to allow)
    const body = await req.json();
    const { is_approved } = body;

    // basic validation: allow only boolean or 0/1
    if (typeof is_approved !== "boolean" && is_approved !== 0 && is_approved !== 1) {
      return NextResponse.json(
        { success: false, message: "Invalid payload: is_approved must be boolean" },
        { status: 400 }
      );
    }

    // Normalize 0/1 to boolean
    const approvedValue = is_approved === 1 ? true : is_approved === 0 ? false : is_approved;

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { is_approved: approvedValue },
      { new: true }
    );

    if (!updatedListing) {
      return NextResponse.json(
        { success: false, message: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedListing });
  } catch (err) {
    console.error("Error updating listing:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
