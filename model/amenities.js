import mongoose from "mongoose";

const amenitiesSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true, // same as Laravel string (not null)
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // slug should usually be unique
    },
    status: {
      type: Boolean,
      default: true, // like Laravel boolean
    },
  },
  {
    timestamps: true, // same as $table->timestamps();
  }
);

export default  mongoose.models.Amenity || mongoose.model("Amenity", amenitiesSchema);


