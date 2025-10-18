import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Amenity from "@/model/amenities"; // Assuming your model file is named amenities.js

// GET: Fetch all amenities
export async function GET() {
  await dbConnect();

  try {
    const amenities = await Amenity.find({}).sort({ createdAt: -1 });
    return NextResponse.json(amenities);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

