import mongoose from "mongoose";
import User from "./user";
import Package from "./package";
import Order from "./order";

const SubscriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    purchase_date: {
      type: Date,
      default: Date.now, // auto set on creation
    },
    expire_date: {
      type: Date,
      default: null, // nullable equivalent
    },
    status: {
      type: Boolean,
      default: false, // equivalent of default(0)
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
