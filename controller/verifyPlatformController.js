const Platform = require("../models/Platform");
const sendToPabbly = require("../utils/sendToPabbly");

exports.verifyPlatform = async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { platformName, platformDetails } = req.body;

  if (!platformName || !platformDetails?.userId || !platformDetails?.password) {
    return res.status(400).json({ message: "Invalid platform data" });
  }

  const platformEntry = {
    platformName,
    platformDetails,
    isValid: false
  };

  let userPlatform = await Platform.findOne({ user: userId });
  if (!userPlatform) {
    userPlatform = new Platform({
      user: userId,
      platforms: [platformEntry]
    });
  } else {
    userPlatform.platforms.push(platformEntry);
  }

  await userPlatform.save();

  const latestPlatform = userPlatform.platforms[userPlatform.platforms.length - 1];

  // Send to Pabbly with callback
  await sendToPabbly({
    user: userId,
    _id: latestPlatform._id,
    platformName,
    platformDetails,
  });

  res.status(200).json({ message: "Platform submitted for verification" });
};
