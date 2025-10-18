import mongoose from "mongoose";

import Listing from "./listing";

const listingImageGallerySchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to listings collection
      ref: "Listing",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export default mongoose.models.ListingImageGallery ||
  mongoose.model("ListingImageGallery", listingImageGallerySchema);
