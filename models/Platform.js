const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platforms: [
      {
        platformName: {
          type: String,
          required: true,
          enum: ["facebook", "twitter", "instagram", "linkedin"],
        },
        platformDetails: {
          type: mongoose.Schema.Types.Mixed, // Accepts any object
          required: true,
        },
         isValid: {
        type: Boolean,
        default: false
      },
      isPosted:{
         type:Boolean,
         default:false,
        
      },
    postedId: { type: [String], default: [] },
      },
    ],
     
  },
  { timestamps: true }
);

module.exports = mongoose.model("Platform", platformSchema);
