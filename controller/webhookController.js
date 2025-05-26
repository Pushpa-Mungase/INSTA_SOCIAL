const Platform = require("../models/Platform");



const ScheduledPost = require("../models/Post");

exports.handlePabblyVerification = async (req, res) => {
  try {
    const { userMongoId, platformId, isValid } = req.body;

    if (!userMongoId || !platformId) {
      return res.status(400).json({ error: "Missing identifiers" });
    }

    const platform = await Platform.findOne({ user: userMongoId });
    if (!platform) {
      return res.status(404).json({ error: "User's platform not found" });
    }

    const updatedPlatforms = platform.platforms.map(p => {
      if (p._id.toString() === platformId) {
        return { ...p._doc, isValid };
      }
      return p;
    });

    platform.platforms = updatedPlatforms;
    await platform.save();

    res.status(200).json({ message: "Verification status updated" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Server error" });
  }
};







exports.handlePostVerification = async (req, res) => {
  try {
    const { postId, platformId, isValid } = req.body;

    if (!postId || !platformId) {
      return res.status(400).json({ error: "Missing identifiers" });
    }

    const post = await ScheduledPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Scheduled post not found" });
    }

    const updatedPlatforms = post.platforms.map(p => {
      // platformId may be string, so ensure comparison works
      if (p._id.toString() === platformId) {
        return { ...p._doc, isValid };
      }
      return p;
    });

    post.platforms = updatedPlatforms;
    await post.save();

    res.status(200).json({ message: "Post verification status updated" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
