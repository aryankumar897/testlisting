import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ListingSchedule from "@/model/listingSchedule";

// ✅ GET — Fetch all schedules for a given listing
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const listing_id = searchParams.get("listing_id");

  try {
    const schedules = await ListingSchedule.find({ listing_id })
      .populate("listing_id", "title") // optional: show listing info
      .sort({ createdAt: -1 });
    return NextResponse.json(schedules);
  } catch (err) {
    console.error("Error fetching schedules:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ✅ POST — Create a new schedule entry
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const newSchedule = await ListingSchedule.create(body);
    return NextResponse.json(newSchedule);
  } catch (err) {
    console.error("Error creating schedule:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
