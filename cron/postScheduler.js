const cron = require("node-cron");
const ScheduledPost = require("../models/Post");
const Platform = require("../models/Platform");
const sendToPabblyPost = require("../utils/sendToPabblyPost");

// Core logic without req, res — returns summary or throws error
const processScheduledPosts = async () => {
  // const now = new Date();
  // const windowStart = new Date(now.getTime() - 20 * 60 * 1000);
  // console.log(windowStart,now);


  //   const nowUTC = new Date();
  // const nowIST = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000); // IST conversion
  // const windowStart = new Date(nowIST.getTime() - 30 * 60 * 1000);

  const nowUTC = new Date();
const windowStart = new Date(nowUTC.getTime() - 30 * 60 * 1000);

  console.log("IST Time Range:", windowStart, "to", nowUTC);
  
  const posts = await ScheduledPost.find({
    isPosted: false,
    scheduledFor: { $gte: windowStart, $lte: nowUTC },
  });

  if (posts.length === 0) {
    return { message: "No scheduled posts to process" };
  }

  const sentPayloads = [];

  for (const post of posts) {
    const platformDoc = await Platform.findOne({ user: post.createdBy });
    const allPlatforms = platformDoc?.platforms || [];

    const validPlatforms = allPlatforms.filter(p =>
      post.platforms.includes(p._id.toString()) && p.isValid
    );

    for (const platform of validPlatforms) {
      const payload = {
        postId: post._id,
        content: post.content,
        scheduledFor: post.scheduledFor,
        platform: {
          platformId: platform._id,
          name: platform.platformName,
        },
        createdBy: post.createdBy,
        media: {
          images: post.imageUrls,
          videos: post.videoUrls,
          audios: post.audioUrls,
        },
      };

      await sendToPabblyPost(payload);

      sentPayloads.push(payload);
    }

    // post.isPosted = true;
    // post.status = "posted";
    await post.save();
  }

  return { message: `✅ Sent ${sentPayloads.length} posts`, data: sentPayloads };
};

// Express handler wrapper
const runScheduledPostCron = async (req, res) => {
  try {
    const result = await processScheduledPosts();
    console.log("result",result)
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error in manual cron trigger:", err.message);
    res.status(500).json({ error: "Cron execution failed", details: err.message });
  }
};

// Schedule cron to run core logic, no req/res needed
cron.schedule("*/30 * * * *", () => {
  console.log("⏰ Running scheduled post cron...");
  processScheduledPosts().catch(err => {
    console.error("❌ Cron job error:", err);
  });
});

module.exports = runScheduledPostCron;
