import mongoose from "mongoose";

import Listing from "./listing"
import User from "./user"
const ChatSchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false, // same as default(0) in Laravel
    },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
