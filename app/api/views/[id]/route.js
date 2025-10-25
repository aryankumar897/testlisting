// app/api/listings/[id]/views/route.js
import { NextResponse } from 'next/server';
import Listing from "@/model/listing"
import dbConnect from '@/utils/dbConnect';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;

    // Increment the view count
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      views: updatedListing.views
    });

  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}