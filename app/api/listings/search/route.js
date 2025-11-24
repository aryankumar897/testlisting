import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Listing from "@/model/listing";
import Category from "@/model/category";
import Locations from "@/model/locations";
import Amenity from "@/model/amenities";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const amenities = searchParams.get('amenity');

    console.log('Search params received:', { keyword, category, location, amenities });

    let searchQuery = {
      status: true,
    };

    const conditions = [];

    // Handle category filter
    if (category) {
      const categoryDoc = await Category.findOne({ 
        slug: category.toLowerCase(), 
        status: true 
      });
      
      if (categoryDoc) {
        conditions.push({ category_id: categoryDoc._id });
      }
    }

    // Handle location filter
    if (location) {
      const locationDoc = await Locations.findOne({ 
        slug: location.toLowerCase(), 
        status: true 
      });
      
      if (locationDoc) {
        conditions.push({ location_id: locationDoc._id });
      }
    }

    // Handle keyword search - ONLY in title field
    if (keyword && keyword.trim() !== '') {
      const keywordRegex = new RegExp(keyword.trim(), 'i');
      conditions.push({ title: keywordRegex });
    }

    // Handle amenities filter
    if (amenities) {
      const amenitySlugs = amenities.split(',').map(slug => slug.trim());
      
      // Find amenity documents by slugs
      const amenityDocs = await Amenity.find({ 
        slug: { $in: amenitySlugs },
        status: true 
      });
      
      if (amenityDocs.length > 0) {
        // Get amenity NAMES (since listings store amenity names as strings)
        const amenityNames = amenityDocs.map(amenity => amenity.name);
        
        // Search for listings that have ALL the selected amenity names
        searchQuery.amenities = { $all: amenityNames };
        
        console.log('Amenities filter:', {
          slugs: amenitySlugs,
          names: amenityNames,
          count: amenityNames.length
        });
      }
    }

    // If we have any OR conditions, use $or to match ANY of them
    if (conditions.length > 0) {
      searchQuery.$or = conditions;
    }

    console.log('Final search query:', searchQuery);

    // Fetch listings with populated data
    const listings = await Listing.find(searchQuery)
      .populate('user_id', 'name email')
      .populate('category_id', 'name slug image_icon background_image')
      .populate('location_id', 'name slug')
      .populate('package_id', 'name')
      .sort({ is_featured: -1, createdAt: -1 });

    console.log('Found listings:', listings.length);

    return NextResponse.json({ 
      success: true,
      data: listings,
      count: listings.length,
      searchParams: { keyword, category, location, amenities }
    });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ 
      success: false,
      error: err.message 
    }, { status: 500 });
  }
}