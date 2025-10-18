// app/api/admin/product-gallery/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ListingImageGallery from "@/model/listingimagegallery";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

import Subscription from "@/model/subscription";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const listing_id = searchParams.get("listing_id");

  try {
    const gallery = await ListingImageGallery.find({ listing_id }).sort({
      createdAt: -1,
    });
    return NextResponse.json(gallery);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}




export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  console.log("body", body);

  const { listing_id, image } = body;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      console.error("[AUTH] Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = session.user?._id;

    const listingImagesCount = await ListingImageGallery.countDocuments({
      listing_id,
    });

    const subscriptions = await Subscription.findOne({
      user_id: user_id,
      status: true,
    }).populate("package_id");

    const packageImageLimit = subscriptions?.package_id?.num_of_photos;

    // // 4️⃣ Check if total exceeds the package limit
    // if (listingImagesCount >= packageImageLimit) {
    //   return NextResponse.json(
    //     {
    //       err: `You have reached the maximum limit of ${packageImageLimit} images`,
    //     },
    //     { status: 400 }
    //   );
    // }


     // 4️⃣ Check if total exceeds the package limit (skip check if limit is -1 for unlimited)
    if (packageImageLimit !== -1 && listingImagesCount >= packageImageLimit) {
      return NextResponse.json(
        {
          err: `You have reached the maximum limit of ${packageImageLimit} images`,
        },
        { status: 400 }
      );
    }

    const newImage = await ListingImageGallery.create(body);
    return NextResponse.json(newImage);
  } catch (err) {
    console.log("error uploading image", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
