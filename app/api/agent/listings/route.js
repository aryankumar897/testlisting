
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Listing from "@/model/listing";
import slugify from "slugify";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

import Subscription from "@/model/subscription";

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      console.error("[AUTH] Unauthorized access");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user?._id;

    const listings = await Listing.find({
      user_id: userId,
    })
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
    is_approved = false,
    amenities = [],
    views = 0,
  } = body;

  console.log("body2222222222222222222222", body);

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

    //checking subscription

    // Count user's active listings (status: 1)
    const userListingCount = await Listing.countDocuments({
      user_id: user_id,
      status: 1,
    });

    const subscriptions = await Subscription.findOne({
      user_id: user_id,
      status: true,
    }).populate("package_id");

    const packageListingLimit = subscriptions?.package_id?.num_of_listing



    // if (userListingCount >= packageListingLimit) {
    //   return NextResponse.json(
    //     {
    //       err: `You have reached the maximum limit of ${packageListingLimit} listings`,
    //     },
    //     { status: 403 }
    //   );
    // }


    //for unlimited


     // Check listing limit (skip if limit is -1 for unlimited)
    if (packageListingLimit !== -1 && userListingCount >= packageListingLimit) {
      return NextResponse.json(
        {
          err: `You have reached the maximum limit of ${packageListingLimit} listings`,
        },
        { status: 403 }
      );
    }





    const packageAmenitiesLimit = subscriptions?.package_id?.num_of_amenities

    if (!Array.isArray(amenities)) {
      return NextResponse.json(
        { err: "Amenities must be an array" },
        { status: 400 }
      );
    }


    // if (amenities.length > packageAmenitiesLimit) {
    //   return NextResponse.json(
    //     {
    //       err: `You can only use ${packageAmenitiesLimit} amenities`,
    //     },
    //     { status: 400 }
    //   );
    // }


    // for unlimited

       // Check amenities limit (skip if limit is -1 for unlimited)
    if (packageAmenitiesLimit !== -1 && amenities.length > packageAmenitiesLimit) {
      return NextResponse.json(
        {
          err: `You can only use ${packageAmenitiesLimit} amenities`,
        },
        { status: 400 }
      );
    }

    //has featured
    const packageFeaturedListingLimit =
      subscriptions?.package_id?.num_of_featured_listing
    const userFeaturedListingCount = await Listing.countDocuments({
      user_id: user_id,
      status: 1,
      is_featured: 1,
    });


    // if (userFeaturedListingCount >= packageFeaturedListingLimit) {
    //   return NextResponse.json(
    //     {
    //       err: `You have reached the maximum limit of ${packageFeaturedListingLimit} featured listings`,
    //     },
    //     { status: 400 }
    //   );
    // }


    // for unlimited

      // Check featured listing limit (skip if limit is -1 for unlimited)
    if (packageFeaturedListingLimit !== -1 && userFeaturedListingCount >= packageFeaturedListingLimit) {
      return NextResponse.json(
        {
          err: `You have reached the maximum limit of ${packageFeaturedListingLimit} featured listings`,
        },
        { status: 400 }
      );
    }


    console.log("Subscription******", subscriptions);
    console.log("userListingCount ******", userListingCount);

    // return;

    //end subscription logic
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
      //  is_verified,
      is_featured,
      amenities,
      is_approved,
      views,
    });

    console.log("saved   agent successfuly", listing);

    return NextResponse.json(listing);
  } catch (err) {
    console.log("lsiting saving error", err);

    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}


