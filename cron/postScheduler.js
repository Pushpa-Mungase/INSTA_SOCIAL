const cron = require("node-cron");
const ScheduledPost = require("../models/Post");
const Platform = require("../models/Platform");
const { postToPlatform } = require("../utils/postingService");

const scheduledPosts = async () => {
  const now = new Date();

  const posts = await ScheduledPost.find({
    scheduledFor: { $lte: now },
    status: "pending",
  }).populate("createdBy");

  for (let post of posts) {
    try {
      const userPlatforms = await Platform.findOne({ user: post.createdBy._id });

      const validPlatforms = post.platforms.filter(platform =>
        userPlatforms.platforms.some(p => p.platformName === platform && p.isValid)
      );

      if (validPlatforms.length === 0) continue;

      for (let platform of validPlatforms) {
        const platformData = userPlatforms.platforms.find(p => p.platformName === platform);
        await postToPlatform(platform, platformData.platformDetails, post);
      }

      post.status = "posted";
      post.isPosted = true;
      await post.save();
    } catch (error) {
      console.error("Failed to post scheduled post:", error);
      post.status = "failed";
      await post.save();
    }
  }
};

cron.schedule("*/30 * * * *", () => {
  console.log("⏱️ Running scheduled post cron...");
  scheduledPosts();
});

module.exports = scheduledPosts;
