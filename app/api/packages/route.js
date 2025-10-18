import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Package from "@/model/package"; // ensure this path matches your project

// GET: Fetch all packages

export async function GET() {
  await dbConnect();

  try {
    const packages = await Package.find({ show_at_home: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json(packages);

  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
