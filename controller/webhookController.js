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

    const updatedPlatforms = platform.platforms.map((p) => {
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
    const { postId, platformId, isPosted, postedId } = req.body;

    console.log("req.body", req.body);
    console.log("Incoming Data:", { postId, platformId, isPosted, postedId });

    if (!postId || !platformId) {
      return res.status(400).json({ error: "Missing postId or platformId" });
    }

    const post = await ScheduledPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Scheduled post not found" });
    }

    if (typeof isPosted === "boolean") {
      post.isPosted = isPosted;
      await post.save();
    }

    const platformDoc = await Platform.findOne({ "platforms._id": platformId });

    if (!platformDoc) {
      return res.status(404).json({ error: "Platform document not found" });
    }

    const platformEntry = platformDoc.platforms.find(
      (p) => p._id.toString() === platformId
    );

    if (!platformEntry) {
      return res.status(404).json({ error: "Platform entry not found" });
    }

    // Update isPosted flag
    if (typeof isPosted === "boolean") {
      platformEntry.isPosted = isPosted;
    }

    // Ensure postedId array is initialized
    if (!Array.isArray(platformEntry.postedId)) {
      platformEntry.postedId = [];
    }

    // Safely add postedId if not duplicate
    if (postedId && !platformEntry.postedId.includes(postedId)) {
      platformEntry.postedId = [...platformEntry.postedId, postedId]; // assign new array to trigger change
    }

    // Mark nested array as modified
    platformDoc.markModified("platforms");
    await platformDoc.save();

    console.log("posted successfully!!");
    return res
      .status(200)
      .json({ message: "Post and platform status updated successfully" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
