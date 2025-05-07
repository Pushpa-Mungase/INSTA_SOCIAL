// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema(
//   {
//     postedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     discription: {
//       type: String,
//     },
//     images: [
//       {
//         type: String,
//       },
//     ],
//     video: [
//       {
//         type: String,
//       },
//     ],
//     scheduledDateTime: {
//       type: Date,
//     },
//     platform: [
//       {
//         type: String,
//         required: true,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export const Post=mongoose.model("Post",postSchema);





const mongoose = require('mongoose');

const scheduledPostSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  platforms: [{ type: String, enum: ['twitter', 'facebook', 'instagram', 'linkedin'] }],
  imageUrls: [{ type: String }],
  videoUrl: { type: String },
  scheduledFor: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'posted', 'failed'],
    default: 'pending'
  },
isPosted: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScheduledPost', scheduledPostSchema);

