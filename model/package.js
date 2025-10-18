import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    number_of_days: {
      type: Number,
      required: true,
    },
    num_of_listing: {
      type: Number,
      default: 0,
    },
    num_of_photos: {
      type: Number,
      default: 0,
    },
    num_of_video: {
      type: Number,
      default: 0,
    },
    num_of_amenities: {
      type: Number,
      default: 0,
    },
    num_of_featured_listing: {
      type: Number,
      default: 0,
    },
    show_at_home: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Package ||
  mongoose.model("Package", packageSchema);
