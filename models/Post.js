import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    video: [
      {
        type: String,
      },
    ],
    scheduledDateTime: {
      type: Date,
    },
    platform: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const Post=mongoose.model("Post",postSchema);
