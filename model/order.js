import mongoose from "mongoose";

import User from "./user";
import Package from "./package";

const OrderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
    },
    user_id: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package_id: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    payment_method: {
      type: String,
    },
    payment_status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "pending",
    },
    base_amount: {
      type: Number,
    },
    base_currency: {
      type: String,
    },

    purchase_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
