const ScheduledPost = require("../models/Post");

const { USER_CTR_MSG } = require("../constant message/constant");
//const logger=require('../logger/index');
require("dotenv").config();

const createScheduledPost = async (req, res) => {
  try {
    if (!req.user || !(req.user._id || req.user.id)) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { content, scheduledFor } = req.body;

    let platforms;
    try {
      platforms = JSON.parse(req.body.platforms);
    } catch (e) {
      return res
        .status(400)
        .json({ error: "Invalid platforms format. Must be a JSON array." });
    }

    // ✅ Validate required fields
    if (!content || !platforms || !scheduledFor) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: content, platforms, or scheduledFor",
        });
    }

    const files = req.files || [];
    const imageUrls = [];
    let videoUrl = [];

    for (const file of files) {
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;
      if (file.mimetype.startsWith("image/")) {
        imageUrls.push(fileUrl);
      } else if (file.mimetype.startsWith("video/") && !videoUrl) {
        videoUrl = fileUrl;
      }
    }

    const newPost = new ScheduledPost({
      createdBy: req.user._id || req.user.id,
      content,
      platforms,
      scheduledFor,
      imageUrls,
      videoUrl,
    });

    await newPost.save();

    res.status(201).json({
      message: "Scheduled post created successfully",
      post: newPost,
    });
  } catch (err) {
    console.error("Error creating scheduled post:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

module.exports = {
  createScheduledPost,
};
