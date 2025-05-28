const axios = require("axios");

async function sendToPabblyPost(data) {
  try {
    const payload = {
      postId: data.postId,
      content: data.content,
      scheduledFor: data.scheduledFor,
      platform: {
        platformId: data.platform.platformId,
        platformName: data.platform.name,
      },
      userId: data.createdBy,
      media: {
        images: data.media.images || [],
        videos: data.media.videos || [],
        audios: data.media.audios || [],
      },
      callbackUrl: "https://1aee-182-156-141-110.ngrok-free.app/api/v1/webhook/post/verify",
    };

    await axios.post(
      "https://connect.pabbly.com/workflow/sendwebhookfiledata/IjU3NjEwNTZmMDYzZjA0MzM1MjZmNTUzMSI_3D_pc/IjU3NjYwNTY4MDYzMjA0MzA1MjZkNTUzNTUxMzEi_pc",
      payload
    );

    console.log("✅ Post data sent to Pabbly");
  } catch (err) {
    console.error("❌ Error sending post data to Pabbly:", err.message);
  }
}

module.exports = sendToPabblyPost;
