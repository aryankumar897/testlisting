// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Package model to interact with the "Package" collection
import Package from "@/model/package";

// ✅ PUT method for updating an existing package
export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();

  try {
    // Extracting the ID and the rest of the update fields
    const { _id, ...updateBody } = body;

    // Find the package by ID and update it
    const updatedPackage = await Package.findByIdAndUpdate(
      context.params.id, // ID of the package
      updateBody, // Updated fields
      { new: true } // Return the updated document
    );

    // Return the updated package
    return NextResponse.json(updatedPackage);
  } catch (err) {
    // Handle any server errors
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ✅ DELETE method for deleting a package
export async function DELETE(req, context) {
  await dbConnect();

  try {
    // Find and delete the package by ID
    const deletedPackage = await Package.findByIdAndDelete(context.params.id);

    // Return the deleted package info
    return NextResponse.json(deletedPackage);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// ✅ GET method for fetching a single package by ID
export async function GET(req, context) {
  await dbConnect();

  try {
    // Find the package by ID
    const pkg = await Package.findById(context.params.id);

    // If not found, return 404
    if (!pkg) {
      return NextResponse.json({ err: "Package not found" }, { status: 404 });
    }

    // Return the found package
    return NextResponse.json(pkg);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
