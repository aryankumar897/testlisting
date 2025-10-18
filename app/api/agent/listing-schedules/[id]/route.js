import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ListingSchedule from "@/model/listingSchedule";

// ✅ UPDATE — Edit a schedule
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();

  try {
    const updated = await ListingSchedule.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updated)
      return NextResponse.json({ err: "Schedule not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating schedule:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ✅ DELETE — Remove a schedule
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const deleted = await ListingSchedule.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ err: "Schedule not found" }, { status: 404 });
    return NextResponse.json({ message: "Schedule deleted" });
  } catch (err) {
    console.error("Error deleting schedule:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
