const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//const platformSchema = require("../models/Platform");
const Platform = require("../models/Platform");
const sendToPabbly = require("../utils/sendToPabbly");

async function encryptPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
}

// const createPlatform = async (req, res) => {
//   try {
//     const userId = req.user._id || req.user.id;

//     console.log("userId", userId);

//     if (!userId) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     const { platforms } = req.body;
//     console.log("body", req.body);

//     if (!platforms || !Array.isArray(platforms)) {
//       return res
//         .status(400)
//         .json({ error: "Platforms must be non empty array" });
//     }

//     for (const platform of platforms) {
//       if (platform.platformDetails && platform.platformDetails.password) {
//         platform.platformDetails.password = await encryptPassword(
//           platform.platformDetails.password
//         );
//       } else {
//         return res
//           .status(400)
//           .json({ error: "Password is required for each platform" });
//       }
//     }
//     // Find existing platform doc for the user
//     let userPlatforms = await Platform.findOne({ user: userId });

//     if (!userPlatforms) {
//       // Create new document if not exists
//       userPlatforms = new Platform({
//         user: userId,
//         platforms,
//       });
//     } else {
//       // Replace the platforms array
//       userPlatforms.platforms = platforms;
//       console.log("platforms", platforms);
//     }

//     await userPlatforms.save();

//     res.status(200).json({
//       message: "Platforms updated successfully",
//       platforms: userPlatforms,
//     });

//         // Call Pabbly for each platform entry
//     for (const p of newPlatform.platforms) {
//       await sendToPabbly({
//         platformName: p.platformName,
//         platformDetails: p.platformDetails,
//         user: userId,
//         _id: p._id, // subdocument ID
//       });
//     }

//     res.status(201).json({ message: "Platforms submitted for verification", platform: newPlatform });

//   } catch (err) {
//     console.error("Create error:", err);
//     res
//       .status(500)
//       .json({ error: "Internal server error", details: err.message });
//   }
// };

// module.exports = { createPlatform };

// const createPlatform = async (req, res) => {
//   try {
//     const userId = req.user._id || req.user.id;

//     if (!userId) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     const { platforms } = req.body;

//     if (!platforms || !Array.isArray(platforms)) {
//       return res.status(400).json({ error: "Platforms must be a non-empty array" });
//     }

//     // Temporarily store plaintext for Pabbly
//     const platformsWithPlain = [];

//     for (const platform of platforms) {
//       const originalPassword = platform.platformDetails?.password;
//       if (!originalPassword) {
//         return res.status(400).json({ error: "Password is required for each platform" });
//       }

//       const hashed = await encryptPassword(originalPassword);

//       platformsWithPlain.push({
//         ...platform,
//         platformDetails: {
//           ...platform.platformDetails,
//           password: hashed
//         },
//         _plaintextPassword: originalPassword // temp field for Pabbly only
//       });
//     }

//     let userPlatforms = await Platform.findOne({ user: userId });

//     if (!userPlatforms) {
//       userPlatforms = new Platform({
//         user: userId,
//         platforms: platformsWithPlain.map(p => {
//           const { _plaintextPassword, ...rest } = p;
//           return rest;
//         })
//       });
//     } else {
//       userPlatforms.platforms = platformsWithPlain.map(p => {
//         const { _plaintextPassword, ...rest } = p;
//         return rest;
//       });
//     }

//     await userPlatforms.save();

//     // Send to Pabbly using plaintext password
//     for (const p of platformsWithPlain) {
//       await sendToPabbly({
//         platformName: p.platformName,
//         platformDetails: {
//           userId: p.platformDetails.userId,
//           password: p._plaintextPassword
//         },
//         user: userId,
//         _id: userPlatforms.platforms.find(
//           pl => pl.platformName === p.platformName
//         )._id
//       });
//     }

//     res.status(200).json({
//       message: "Platforms submitted for verification",
//       platforms: userPlatforms
//     });

//   } catch (err) {
//     console.error("Create error:", err);
//     res.status(500).json({ error: "Internal server error", details: err.message });
//   }
// };

const createPlatform = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { platforms } = req.body;

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res
        .status(400)
        .json({ error: "Platforms must be a non-empty array" });
    }

    // Hash passwords & add _plaintextPassword for Pabbly temporarily
    const platformsWithPlain = [];
    for (const platform of platforms) {
      if (!platform.platformDetails?.password) {
        return res
          .status(400)
          .json({ error: "Password is required for each platform" });
      }
      const hashed = await encryptPassword(platform.platformDetails.password);
      platformsWithPlain.push({
        ...platform,
        platformDetails: {
          ...platform.platformDetails,
          password: hashed,
        },
        _plaintextPassword: platform.platformDetails.password,
      });
    }

    // Find existing user platforms doc
    let userPlatforms = await Platform.findOne({ user: userId });

    if (!userPlatforms) {
      // If none exists, create new
      userPlatforms = new Platform({
        user: userId,
        platforms: platformsWithPlain.map((p) => {
          const { _plaintextPassword, ...rest } = p;
          return rest;
        }),
      });
    } else {
      // Append or update platforms in array without removing existing ones
      for (const newPlatform of platformsWithPlain) {
        const existingIndex = userPlatforms.platforms.findIndex(
          (p) => p.platformName === newPlatform.platformName
        );

        const { _plaintextPassword, ...platformDataWithoutPlain } = newPlatform;

        if (existingIndex !== -1) {
          // Update existing platform entry
          userPlatforms.platforms[existingIndex] = platformDataWithoutPlain;
        } else {
          // Add new platform to array
          userPlatforms.platforms.push(platformDataWithoutPlain);
        }
      }
    }

    await userPlatforms.save();

    // Send plaintext passwords to Pabbly for verification
    for (const p of platformsWithPlain) {
      const platformRecord = userPlatforms.platforms.find(
        (pl) => pl.platformName === p.platformName
      );
      await sendToPabbly({
        platformName: p.platformName,
        platformDetails: {
          userId: p.platformDetails.userId,
          password: p._plaintextPassword,
        },
        user: userId,
        _id: platformRecord?._id,
      });
    }

    res.status(200).json({
      message: "Platforms submitted for verification",
      data: { platforms: userPlatforms },
      success: true
    });
  } catch (err) {
    console.error("Create error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

const getUserPlatforms = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("from get user platform",userId);
    

    // Find the platform document for the user
    const userPlatformsDoc = await Platform.findOne({ user: userId });

    if (!userPlatformsDoc) {
      return res.status(404).json({ message: "No platforms connected yet" });
    }


    const allPlatforms = userPlatformsDoc?.platforms || [];
console.log("All Platforms",allPlatforms);


const validPlatforms = allPlatforms.filter(p => p.isValid === true);

    // Filter only valid platforms
   

    if (validPlatforms.length === 0) {
      return res.status(404).json({ message: "No valid platforms found" });
    }

    res.status(200).json({ platforms: validPlatforms });
  } catch (error) {
    console.error("Error fetching platforms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { createPlatform, getUserPlatforms };
