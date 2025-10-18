import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Amenity from "@/model/amenities"; // Assuming your model file is named amenities.js
import slugify from "slugify";

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

// POST: Create a new amenity with additional fields
export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  console.log("body", body);

  const {
    name,
    icon,
    status = true,
  } = body;

  try {
    const amenity = await Amenity.create({
      name,
      icon,
      slug: slugify(name, { lower: true }),
      status,
    });

    console.log("amenity", amenity);
    return NextResponse.json(amenity);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}