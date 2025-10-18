import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Listing from "@/model/listing";
import ListingImageGallery from "@/model/listingimagegallery";
import ListingVideoGallery from "@/model/listingvideogallery";
import ListingSchedule from "@/model/listingSchedule";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing listing id" },
        { status: 400 }
      );
    }

    // Get the main listing
    const listing = await Listing.findById(id)
      .populate("user_id", "name email image")
      .populate("category_id", "name slug")
      .populate("location_id", "name slug")
      .lean();

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    console.log("my listing", listing);
    const similarListings = await Listing.find({
      // Get similar listings based on category_id
      category_id: listing.category_id?._id,
      _id: { $ne: id }, // Exclude current listing
      status: true,
      is_approved: true,
    })
      .populate("category_id", "name")
      .select("title image slug")
      .limit(5)
      .lean();

    // Get listing images
    const listingImages = await ListingImageGallery.find({
      listing_id: id,
    })
      .select("image")
      .lean();

    // Get listing videos
    const listingVideos = await ListingVideoGallery.find({
      listing_id: id,
    })
      .select("video")

      .lean();

    // Get listing schedule/opening hours
    const listingSchedule = await ListingSchedule.find({
      listing_id: id,
    })
      .select("day start_time end_time")
      .lean();

    // Format the response
    const responseData = {
      similarListings: similarListings.map((listing) => ({
        _id: listing._id,
        title: listing.title,
        image: listing.image,
        slug: listing.slug,
      })),
      images: listingImages.map((img) => img.image),
      videos: listingVideos.map((video) => ({
        url: video.video,
      })),
      openingHours: listingSchedule.map((schedule) => ({
        day: schedule.day,
        hours: `${schedule.start_time} - ${schedule.end_time}`,
      })),
    };

    
    console.log("responsedata", responseData);
    return NextResponse.json(responseData);
  } catch (err) {
    console.log("Error in GET /api/listings/:id", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
