import mongoose from "mongoose";
import Listing from "./listing";

const listingVideoGallerySchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to listings collection
      ref: "Listing",
      required: true,
    },
    video: {
      type: String, // Cloudinary video URL
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Model name changed to ListingVideoGallery
export default mongoose.models.ListingVideoGallery ||
  mongoose.model("ListingVideoGallery", listingVideoGallerySchema);
