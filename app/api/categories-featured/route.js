import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/model/category";
import Listing from "@/model/listing";

// GET: Fetch all categories
export async function GET() {
  await dbConnect();

  try {
    const featuredCategories = await Category.aggregate([
      {
        $match: {
          show_at_home: true,
          status: true,
        },
      },
      {
        $lookup: {
          from: "listings",
          localField: "_id",
          foreignField: "category_id",
          as: "listings",
        },
      },
      {
        $addFields: {
          listingsCount: {
            $size: {
              $filter: {
                input: "$listings",
                as: "listing",
                cond: { $eq: ["$$listing.is_approved", true] },
              },
            },
          },
        },
      },
      {
        $project: {
          listings: 0,
        },
      },
      {
        $limit: 6,
      },
    ]);

    console.log("featuredCategories", featuredCategories);

    return NextResponse.json(featuredCategories);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
