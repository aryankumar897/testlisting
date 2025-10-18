import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image_icon: {
      type: String,
      default: null,
    },
    background_image: {
      type: String,
      default: null,
    },
    show_at_home: {
      type: Boolean,
      default: false, // same as default(0)
    },
    status: {
      type: Boolean,
      default: true, // same as default(1)
    },
  },
  { timestamps: true } // same as $table->timestamps()
);

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
