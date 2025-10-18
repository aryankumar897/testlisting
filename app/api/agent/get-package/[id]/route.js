// Importing NextResponse from next/server to handle HTTP responses
import { NextResponse } from "next/server";

// Importing dbConnect to establish a connection to the MongoDB database
import dbConnect from "@/utils/dbConnect";

// Importing the Package model to interact with the "Package" collection
import Package from "@/model/package";


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
