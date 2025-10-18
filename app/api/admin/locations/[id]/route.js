// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Location model
import Locations from "@/model/locations";

// Importing slugify for creating slugs from names
import slugify from "slugify";


// ========================= UPDATE LOCATION =========================
export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();

  try {
    const { _id, ...updateBody } = body;

    const updatedLocation = await Locations.findByIdAndUpdate(
      context.params.id,
      updateBody,
      { new: true }
    );

    return NextResponse.json(updatedLocation);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ========================= DELETE LOCATION =========================
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedLocation = await Locations.findByIdAndDelete(context.params.id);

    return NextResponse.json(deletedLocation);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ========================= GET SINGLE LOCATION =========================
export async function GET(req, context) {
  await dbConnect();

  try {
    const location = await Locations.findById(context.params.id);

    if (!location) {
      return NextResponse.json(
        { err: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
