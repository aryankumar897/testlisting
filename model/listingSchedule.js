import mongoose from "mongoose";
import Listing from "./listing";
// Define the schema
const listingScheduleSchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to listings collection
      ref: "Listing",
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export model
export default mongoose.models.ListingSchedule ||
  mongoose.model("ListingSchedule", listingScheduleSchema);
