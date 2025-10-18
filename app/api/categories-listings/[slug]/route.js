import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/model/category";
import Listing from "@/model/listing";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { slug } =await   context.params;
    if (!slug) {
      return NextResponse.json(
        { error: "Missing category slug" },
        { status: 400 }
      );
    }

    const category = await Category.findOne({ slug: slug.trim() });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const [listings] = await Promise.all([
      Listing.find({ category_id: category._id })
        .sort({ createdAt: -1 })

        .populate("category_id")
        .populate("location_id")

        .lean(),
    ]);

  

    return NextResponse.json(listings);
  } catch (err) {
    console.log("Error in GET /categories/:slug/listings", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
