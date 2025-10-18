// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Location model
import Locations from "@/model/locations";


// ========================= GET ALL LOCATIONS =========================
export async function GET() {
  await dbConnect();

  try {
    const locations = await Locations.find({}).sort({ createdAt: -1 });
    return NextResponse.json(locations);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

