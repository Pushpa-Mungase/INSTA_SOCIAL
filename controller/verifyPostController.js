const ScheduledPost = require("../models/ScheduledPost");
const sendToPabblyPost = require("../utils/sendToPabblyPost");
const sendToPabbly = require("../utils/sendToPabblyPost");

exports.verifyScheduledPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await ScheduledPost.findOne({ _id: postId, createdBy: userId });
    if (!post) {
      return res.status(404).json({ message: "Scheduled post not found" });
    }

    const { content, scheduledFor, platforms, imageUrls, videoUrls, audioUrls } = post;

    if (!platforms || platforms.length === 0) {
      return res.status(400).json({ message: "No platforms found for this post" });
    }

    for (const platform of platforms) {
      await sendToPabblyPost({
        postId,
        content,
        scheduledFor,
        platform: {
          name: platform.platformName,
          platformId: platform.platformId,
        },
        media: {
          images: imageUrls || [],
          videos: videoUrls || [],
          audios: audioUrls || [],
        },
        createdBy: userId,
        isVerification: true, // Optional flag for webhook to handle verification mode
      });
    }

    res.status(200).json({ message: "Post sent for verification to all platforms" });

  } catch (err) {
    console.error("Error verifying scheduled post:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
