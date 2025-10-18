import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Locations from "@/model/locations";

// GET: Fetch all categories
export async function GET() {
  await dbConnect();

  try {
    const featuredLocations = await Locations.aggregate([
      // Step 1: Filter locations that should show at home
      {
        $match: {
          show_at_home: true,
          status: true,
        },
      },
      // Step 2: Join with listings and apply filters
      {
        $lookup: {
          from: "listings", // Collection name for listings
          let: { locationId: "$_id" }, // Store current location's _id in a variable
          pipeline: [
            {
              $match: {
                // Join condition: listing.location_id == location._id
                $expr: { $eq: ["$location_id", "$$locationId"] },
                // Additional filters for listings
                status: true,
                is_approved: true,
              },
            },
            // Sort by _id descending (equivalent to orderBy('id', 'desc'))
            { $sort: { _id: -1 } },
            // Limit to 8 listings per location
            { $limit: 8 },
            // Populate category_id
            {
              $lookup: {
                from: "categories", // Collection name for categories
                localField: "category_id", // Field in listings collection
                foreignField: "_id", // Field in categories collection
                as: "category_data", // Store populated category data
              },
            },
            // Populate location_id
            {
              $lookup: {
                from: "locations", // Collection name for locations
                localField: "location_id", // Field in listings collection
                foreignField: "_id", // Field in locations collection
                as: "location_data", // Store populated location data
              },
            },
            // Convert category array to object
            {
              $unwind: {
                path: "$category_data",
                preserveNullAndEmptyArrays: true, // Keep listings even if category not found
              },
            },
            // Convert location array to object
            {
              $unwind: {
                path: "$location_data",
                preserveNullAndEmptyArrays: true, // Keep listings even if location not found
              },
            },
            // Replace the original fields with populated data
            {
              $addFields: {
                "category_id": "$category_data", // Replace category_id with populated category
                "location_id": "$location_data", // Replace location_id with populated location
              },
            },
            // Remove temporary fields
            {
              $project: {
                category_data: 0,
                location_data: 0,
              },
            },
          ],
          as: "listings", // Output field name
        },
      },
    ]);

    console.log(
      "Featured Locations with Populated Listings:",
      JSON.stringify(featuredLocations, null, 2)
    );
    return NextResponse.json(featuredLocations);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}