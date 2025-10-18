import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Package from "@/model/package"; // ensure this path matches your project

// GET: Fetch all packages
export async function GET() {
  await dbConnect();

  try {
    const packages = await Package.find({}).sort({ createdAt: -1 });
    return NextResponse.json(packages);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}






// POST: Create a new package
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    // Destructure and provide defaults
    const {
      type = "free", // "free" | "paid"
      name,
      price = 0,
      number_of_days = 0,
      num_of_listing = 0,
      num_of_photos = 0,
      num_of_video = 0,
      num_of_amenities = 0,
      num_of_featured_listing = 0,
      show_at_home = false,
      status = true,
    } = body;

    // Basic validation
    if (!name) {
      return NextResponse.json({ err: "Package name is required" }, { status: 400 });
    }
    if (!["free", "paid"].includes(type)) {
      return NextResponse.json({ err: "Invalid package type" }, { status: 400 });
    }

    // Ensure numeric fields are numbers
    const parsedPrice = Number(price) || 0;
    const parsedNumberOfDays = parseInt(number_of_days, 10) || 0;
    const parsedNumOfListing = parseInt(num_of_listing, 10) || 0;
    const parsedNumOfPhotos = parseInt(num_of_photos, 10) || 0;
    const parsedNumOfVideo = parseInt(num_of_video, 10) || 0;
    const parsedNumOfAmenities = parseInt(num_of_amenities, 10) || 0;
    const parsedNumOfFeaturedListing = parseInt(num_of_featured_listing, 10) || 0;

    const pkg = await Package.create({
      type,
      name,
      price: parsedPrice,
      number_of_days: parsedNumberOfDays,
      num_of_listing: parsedNumOfListing,
      num_of_photos: parsedNumOfPhotos,
      num_of_video: parsedNumOfVideo,
      num_of_amenities: parsedNumOfAmenities,
      num_of_featured_listing: parsedNumOfFeaturedListing,
      show_at_home,
      status,
      // slug: slugify(name, { lower: true }), // uncomment if your model contains slug
    });

    return NextResponse.json(pkg);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
