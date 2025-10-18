// app/api/admin/product-gallery/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ListingVideoGallery from "@/model/listingvideogallery"

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const listing_id = searchParams.get("listing_id");

  try {
    const gallery = await ListingVideoGallery.find({ listing_id })
      .sort({ createdAt: -1 });
    return NextResponse.json(gallery);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

 console.log("body", body)



  try {
    const newVideo = await ListingVideoGallery.create(body);
    return NextResponse.json(newVideo);
  } catch (err) {
 console.log("error uploading image" , err)

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}