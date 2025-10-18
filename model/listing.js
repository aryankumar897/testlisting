import mongoose from "mongoose";

import User from "./user";
import Category from "./category";

import Locations from "./locations";

const listingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locations",
      required: true,
    },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null,
    },

    image: { type: String },
    thumbnail_image: { type: String },
    title: { type: String, required: true },
    slug: { type: String },
    //description: { type: String },
    description: { type: mongoose.Schema.Types.Mixed, default: null },

    phone: { type: String },
    email: { type: String },
    address: { type: String },
    website: { type: String, default: null },
    facebook_link: { type: String, default: null },
    x_link: { type: String, default: null },
    linkedin_link: { type: String, default: null },
    whatsapp_link: { type: String, default: null },

    is_verified: { type: Boolean, default: false },
    is_featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },

    google_map_embed_code: { type: String, default: null },
    file: { type: String, default: null },
    expire_date: { type: Date },
    amenities: [{ type: String }],

    status: {
      type: Boolean,
      default: false,
    },

    is_approved: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date, default: null }, // equivalent to softDeletes
  },
  { timestamps: true }
);

export default mongoose.models.Listing ||
  mongoose.model("Listing", listingSchema);
