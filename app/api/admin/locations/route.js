// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Location model
import Locations from "@/model/locations";

// Importing slugify for creating slugs from names
import slugify from "slugify";

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

// ========================= CREATE LOCATION =========================
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  console.log("body", body);

  const { name, status = true, show_at_home = false } = body;

  try {
    const location = await Locations.create({
      name,
      slug: slugify(name, { lower: true }),
      status,
      show_at_home,
    });

    console.log("location", location);
    return NextResponse.json(location);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

