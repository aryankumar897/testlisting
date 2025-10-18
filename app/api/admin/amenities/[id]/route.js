// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Amenity model to interact with the "Amenity" collection
import Amenity from "@/model/amenities";

// PUT method for updating an existing amenity
export async function PUT(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  // Parsing the incoming request body as JSON
  const body = await req.json();

  try {
    // Destructuring the _id field from the body to separate it from the fields to be updated
    const { _id, ...updateBody } = body;

    // Finding the amenity by its ID and updating it with the new data
    const updatedAmenity = await Amenity.findByIdAndUpdate(
      context.params.id, // The amenity ID to update
      updateBody, // The fields to update
      { new: true } // Return the updated document
    );

    // Returning the updated amenity as a JSON response
    return NextResponse.json(updatedAmenity);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// DELETE method for deleting an amenity
export async function DELETE(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  try {
    // Finding the amenity by its ID and deleting it
    const deletedAmenity = await Amenity.findByIdAndDelete(
      context.params.id // The amenity ID to delete
    );

    // Returning the deleted amenity as a JSON response
    return NextResponse.json(deletedAmenity);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// GET method for fetching a single amenity by ID
export async function GET(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  try {
    // Finding the amenity by its ID
    const amenity = await Amenity.findById(context.params.id);

    // If amenity not found, return 404 error
    if (!amenity) {
      return NextResponse.json(
        { err: "Amenity not found" },
        { status: 404 }
      );
    }

    // Returning the found amenity as a JSON response
    return NextResponse.json(amenity);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}