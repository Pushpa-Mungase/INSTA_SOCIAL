// const mongoose = require("mongoose");

// const scheduledPostSchema = new mongoose.Schema({
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   content: { type: String, required: true },
//   platforms: [
//     { type: String, enum: ["twitter", "facebook", "instagram", "linkedin"] },
//   ],
//   imageUrls: [{ type: String }],
//   videoUrls: [{ type: String }],
//   scheduledFor: { type: Date, required: true },
//   status: {
//     type: String,
//     enum: ["pending", "posted", "failed"],
//     default: "pending",
//   },
//   isPosted: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("ScheduledPost", scheduledPostSchema);

const mongoose = require("mongoose");

const scheduledPostSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
  },

  content: {
    type: String,
    required: true,
  },

  // platforms: [
  //   {
  //     platformId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       required: true,
  //     },
  //     platformName: {
  //       type: String,
  //       enum: ["facebook", "twitter", "instagram", "linkedin"],
  //       required: true,
  //     },
  //     isPosted: {
  //       type: Boolean,
  //       default: false,
  //     },
  //     postResponse: {
  //       type: String, // optional: response or error from Pabbly
  //     },
  //   },
  // ],

  platforms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platform.platforms", // nested schema reference (manual population)
      required:true
    },
  ],

  imageUrls: [{ type: String }],
  videoUrls: [{ type: String }],
  audioUrls: [{ type: String }], // optional if you support audio

  scheduledFor: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "posted", "failed"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ScheduledPost", scheduledPostSchema);
