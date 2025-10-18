// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";
import Claim from "@/model/claim";

// DELETE method for deleting a category
export async function DELETE(req, context) {
  // Establishing a connection to the database
  await dbConnect();

  try {
    // Finding the category by its ID and deleting it
    const deletedClaim = await Claim.findByIdAndDelete(
      context.params.id // The category ID to delete
    );

    // Returning the deleted category as a JSON response
    return NextResponse.json(deletedClaim);
  } catch (err) {
    // If an error occurs, returning a 500 error with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
