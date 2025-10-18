import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Listing from "@/model/listing";

import slugify from "slugify";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function GET() {
  await dbConnect();

  try {
    const listings = await Listing.find({})
      .populate("category_id", "name")
      .populate("location_id", "name")
      .sort({ createdAt: -1 });
    console.log("listing getting", listings);
    return NextResponse.json(listings);
  } catch (err) {
    console.log("getting listing", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}



export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  const {
    category_id,
    location_id,
    package_id = null,
    title,
    slug = null,
    description = null,
    phone = "",
    email = "",
    address = "",
    website = null,
    facebook_link = null,
    x_link = null,
    linkedin_link = null,
    whatsapp_link = null,
    image = "",
    thumbnail_image = "",
    google_map_embed_code = null,
    file = null,
    expire_date = null,
    status = null,
    is_verified = false,
    is_featured = false,
    is_approved = true,
    amenities = [],
    views = 0,
  } = body;

  console.log("body", body);

  try {
    // required validation

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      console.error("[AUTH] Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = session.user?._id;
    const missing = [];
    if (!user_id) missing.push("user_id");
    if (!category_id) missing.push("category_id");
    if (!location_id) missing.push("location_id");
    if (!title) missing.push("title");
    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const listing = await Listing.create({
      user_id,
      category_id,
      location_id,
      package_id,
      title,
      slug: slug || slugify(title || "", { lower: true, strict: true }),
      description,
      phone,
      email,
      address,
      website,
      facebook_link,
      x_link,
      linkedin_link,
      whatsapp_link,
      image,
      thumbnail_image,
      google_map_embed_code,
      file,
      expire_date,
      status,
      is_verified,
      is_featured,
      amenities,
      is_approved,
      views,
    });

    console.log("saved  successfuly", listing);

    return NextResponse.json(listing);
  } catch (err) {
    console.log("lsiting saving error", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
