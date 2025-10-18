// app/api/admin/product-gallery/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ListingVideoGallery from "@/model/listingvideogallery";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

import Subscription from "@/model/subscription";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const listing_id = searchParams.get("listing_id");

  try {
    const gallery = await ListingVideoGallery.find({ listing_id }).sort({
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
  const { listing_id } = body;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      console.error("[AUTH] Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = session.user?._id;

    const listingVideosCount = await ListingVideoGallery.countDocuments({
      listing_id,
    });

    const subscriptions = await Subscription.findOne({
      user_id: user_id,
      status: true,
    }).populate("package_id");

    const packageVideosLimit = subscriptions?.package_id?.num_of_video


    // if (listingVideosCount >= packageVideosLimit) {
    //   return NextResponse.json(
    //     {
    //       err: `You have reached the maximum limit of ${packageVideosLimit} videos`,
    //     },
    //     { status: 400 }
    //   );
    // }


     // Check if total exceeds the package limit (skip check if limit is -1 for unlimited)
    if (packageVideosLimit !== -1 && listingVideosCount >= packageVideosLimit) {
      return NextResponse.json(
        {
          err: `You have reached the maximum limit of ${packageVideosLimit} videos`,
        },
        { status: 400 }
      );
    }

    const newVideo = await ListingVideoGallery.create(body);
    return NextResponse.json(newVideo);
  } catch (err) {
    console.log("error uploading image", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
