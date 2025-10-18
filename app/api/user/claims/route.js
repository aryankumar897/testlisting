import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Claim from "@/model/claim";

// POST: Create a new category with additional fields
export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  console.log("body", body);

  const { name, listing_id, email, claim } = body;

  try {
    const userclaim = await Claim.create({
      name,
      listing_id,
      email,
      claim,
    });

    console.log("claim", userclaim);
    return NextResponse.json(userclaim);
  } catch (err) {
    console.log(" error", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
