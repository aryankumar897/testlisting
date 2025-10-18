import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Claim from "@/model/claim";

// POST: Create a new category with additional fields
export async function GET(req) {
  await dbConnect();

  try {
    const claim = await Claim.find({})

      .populate("listing_id", "slug"); // Also select only slug from populated listing

    console.log("claim", claim);
    return NextResponse.json(claim);
  } catch (err) {
    console.log(" error", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}