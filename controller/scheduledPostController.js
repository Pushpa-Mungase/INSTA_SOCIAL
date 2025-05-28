const ScheduledPost = require("../models/Post");
const Platform = require("../models/Platform");
const moment=require("moment-timezone");

const mongoose = require('mongoose');

const { USER_CTR_MSG } = require("../constant message/constant");
//const logger=require('../logger/index');
const {uploadOnCloudinary} = require('../config/cloudinary');
const path = require("path");
const sendToPabbly = require("../utils/sendToPabblyPost");
const sendToPabblyPost = require("../utils/sendToPabblyPost");

// const createScheduledPost = async (req, res) => {
//   console.log(req);
//   console.log("user",req.user);
//   try {
//     if (!req.user || !(req.user._id || req.user.id)) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     const { content, scheduledFor,platforms } = req.body;
 
   

//     if (!content || !platforms || !scheduledFor) {
//       return res.status(400).json({
//         error: "Missing required fields: content, platforms, or scheduledFor",
//       });
//     }

//     const files = req.files || [];
//     const imageUrls = [];
//     let videoUrls = [];

//     // for (const file of files) {
//     //   const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
//     //     file.filename
//     //   }`;
//     //   if (file.mimetype.startsWith("image/")) {
//     //     imageUrls.push(fileUrl);
//     //   } else if (file.mimetype.startsWith("video/")) {
//     //     videoUrls.push(fileUrl);
//     //   }
//     // }



// //     for (const file of files) {
// //   let relativePath = "";
// //   const result= await uploadToCloudinary(file.buffer, file.originalname);

// //   if (file.mimetype.startsWith("image/")) {
// //     relativePath = `image/${file.filename}`;
// //     imageUrls.push(relativePath);
// //   } else if (file.mimetype.startsWith("video/")) {
// //     relativePath = `video/${file.filename}`;
// //     videoUrls.push(relativePath);
// //   } else if (file.mimetype.startsWith("audio/")) {
// //     relativePath = `audio/${file.filename}`;
// //     // Optional: push to audioUrls
// //   }
// // }



// for (const file of files) {

//    if (!file?.buffer) {
//     console.error("Missing buffer for file:", file?.originalname);
//     continue; // Skip this file
//   }
//   const fileName = path.parse(file.originalname).name; // get name without extension
//   const fileExt = path.extname(file.originalname);      // get extension
//   const publicId = `${Date.now()}-${fileName}`;

//   const result = await uploadOnCloudinary(file.buffer, publicId);

//   let relativePath = "";

//   if (file.mimetype.startsWith("image/")) {
//     relativePath = `image/${publicId}${fileExt}`;
//     imageUrls.push(relativePath);
//   } else if (file.mimetype.startsWith("video/")) {
//     relativePath = `video/${publicId}${fileExt}`;
//     videoUrls.push(relativePath);
//   } else if (file.mimetype.startsWith("audio/")) {
//     relativePath = `audio/${publicId}${fileExt}`;
//     audioUrls.push(relativePath);
//   }
// }




//     const newPost = new ScheduledPost({
//        createdBy: req.user._id || req.user.id,
//       content,
//       platforms,
//       scheduledFor,
//       imageUrls,
//       videoUrls,
//     });

//     await newPost.save();

//     res.status(201).json({
//       message: "Scheduled post created successfully",
//       post: newPost,
//     });
//   } catch (err) {
//     console.error("Error creating scheduled post:", err);
//     res.status(500).json({
//       error: "Internal server error",
//       details: err.message,
//     });
//   }
// };






// const createScheduledPost = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     const { content, scheduledFor } = req.body;

//     if (!content || !scheduledFor) {
//       return res.status(400).json({
//         error: "Missing required fields: content or scheduledFor",
//       });
//     }

//     // Get verified platforms for the user
//     const platformDoc = await Platform.findOne({ user: userId });
//     const validPlatforms = (platformDoc?.platforms || []).filter(p => p.isValid);

//     if (validPlatforms.length === 0) {
//       return res.status(400).json({ error: "No verified platforms found" });
//     }

//     const formattedPlatforms = validPlatforms.map(p => ({
//       platformId: p._id,
//       platformName: p.platformName,
//     }));

//     // Upload files
//     const files = req.files || [];
//     const imageUrls = [];
//     const videoUrls = [];
//     const audioUrls = [];

//     for (const file of files) {
//       if (!file?.buffer) continue;

//       const fileName = path.parse(file.originalname).name;
//       const publicId = `${Date.now()}-${fileName}`;
//       const folder = "LMS/scheduledPosts";

//       const result = await uploadOnCloudinary(file.buffer, publicId, folder);
//       if (!result?.secure_url) continue;

//       if (file.mimetype.startsWith("image/")) {
//         imageUrls.push(result.secure_url);
//       } else if (file.mimetype.startsWith("video/")) {
//         videoUrls.push(result.secure_url);
//       } else if (file.mimetype.startsWith("audio/")) {
//         audioUrls.push(result.secure_url);
//       }
//     }

//     // Save post to MongoDB
//     const newPost = new ScheduledPost({
//       createdBy: userId,
//       content,
//       platforms: formattedPlatforms,
//       scheduledFor,
//       imageUrls,
//       videoUrls,
//       audioUrls,
//     });

//     await newPost.save();

//     // Send to Pabbly for each platform
//     for (const p of formattedPlatforms) {
//       await sendToPabbly({
//         postId: newPost._id,
//         content,
//         scheduledFor,
//         platform: {
//           name: p.platformName,
//           platformId: p.platformId,
//         },
//         media: {
//           images: imageUrls,
//           videos: videoUrls,
//           audios: audioUrls,
//         },
//         createdBy: userId,
//       });
//     }

//     return res.status(201).json({
//       message: "Scheduled post created and sent to Pabbly",
//       post: newPost,
//     });

//   } catch (err) {
//     console.error("Error creating scheduled post:", err);
//     res.status(500).json({
//       error: "Internal server error",
//       details: err.message,
//     });
//   }
// };

// module.exports = { createScheduledPost };









// const createScheduledPost = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ error: "User not authenticated" });
//     }

//     const { content, scheduledFor } = req.body;

//     if (!content || !scheduledFor) {
//       return res.status(400).json({
//         error: "Missing required fields: content or scheduledFor",
//       });
//     }

//     // Get all platforms for the user WITHOUT filtering by isValid
//     const platformDoc = await Platform.findOne({ user: userId });
//     const allPlatforms = platformDoc?.platforms || [];

//     if (allPlatforms.length === 0) {
//       return res.status(400).json({ error: "No platforms found for user" });
//     }

//     const formattedPlatforms = allPlatforms.map(p => ({
//       platformId: p._id,
//       platformName: p.platformName,
//     }));

//     // Upload files
//     const files = req.files || [];
//     const imageUrls = [];
//     const videoUrls = [];
//     const audioUrls = [];

//     for (const file of files) {
//       if (!file?.buffer) continue;

//       const fileName = path.parse(file.originalname).name;
//       const publicId = `${Date.now()}-${fileName}`;
//       const folder = "LMS/scheduledPosts";

//       const result = await uploadOnCloudinary(file.buffer, publicId, folder);
//       if (!result?.secure_url) continue;

//       if (file.mimetype.startsWith("image/")) {
//         imageUrls.push(result.secure_url);
//       } else if (file.mimetype.startsWith("video/")) {
//         videoUrls.push(result.secure_url);
//       } else if (file.mimetype.startsWith("audio/")) {
//         audioUrls.push(result.secure_url);
//       }
//     }

//     // Save post to MongoDB
//     const newPost = new ScheduledPost({
//       createdBy: userId,
//       content,
//       platforms: formattedPlatforms,
//       scheduledFor,
//       imageUrls,
//       videoUrls,
//       audioUrls,
//     });

//     await newPost.save();

//     // Send to Pabbly for each platform
//     for (const p of formattedPlatforms) {
//       await sendToPabblyPost({
//         postId: newPost._id,
//         content,
//         scheduledFor,
//         platform: {
//           name: p.platformName,
//           platformId: p.platformId,
//         },
//         media: {
//           images: imageUrls,
//           videos: videoUrls,
//           audios: audioUrls,
//         },
//         createdBy: userId,
//       });
//     }

//     return res.status(201).json({
//       message: "Scheduled post created and sent to Pabbly",
//       post: newPost,
//     });

//   } catch (err) {
//     console.error("Error creating scheduled post:", err);
//     res.status(500).json({
//       error: "Internal server error",
//       details: err.message,
//     });
//   }
// };


const createScheduledPost = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: user ID missing" });
    }

    const { content, scheduledFor,selectedPlatformIds } = req.body;

    if (!content || !scheduledFor || !selectedPlatformIds) {
      return res.status(400).json({
        error: "Missing required fields: content, scheduledFor, or selectedPlatformIds",
      });
    }


     if (!Array.isArray(selectedPlatformIds) || selectedPlatformIds.length === 0) {
      return res.status(400).json({ error: "selectedPlatformIds must be a non-empty array" });
    }

   const platformDoc = await Platform.findOne({ user: userId });
const allPlatforms = platformDoc?.platforms || [];
console.log("All Platforms",allPlatforms);


const validPlatforms = allPlatforms.filter(p => p.isValid === true);

if (validPlatforms.length ==0) {
  return res.status(400).json({ error: "No valid platforms found for user" });
}


const validPlatformIds = validPlatforms.map(p => p._id.toString());

const invalidIds = selectedPlatformIds.filter(id => !validPlatformIds.includes(id));
if (invalidIds.length > 0) {
  return res.status(400).json({ error: "Invalid or unverified platform IDs selected" });
}


    // Upload media files to Cloudinary
    const files = req.files || [];
    const imageUrls = [];
    const videoUrls = [];
    const audioUrls = [];

    for (const file of files) {
      if (!file?.buffer) continue;

      const fileName = path.parse(file.originalname).name;
      const publicId = `${Date.now()}-${fileName}`;
      const folder = "LMS/scheduledPosts";

      const result = await uploadOnCloudinary(file.buffer, publicId, folder);
      if (!result?.secure_url) continue;

      if (file.mimetype.startsWith("image/")) {
        imageUrls.push(result.secure_url);
      } else if (file.mimetype.startsWith("video/")) {
        videoUrls.push(result.secure_url);
      } else if (file.mimetype.startsWith("audio/")) {
        audioUrls.push(result.secure_url);
      }
    }


    const selectedPlatformsDetails = validPlatforms.filter(p =>
  selectedPlatformIds.includes(p._id.toString())
);

const istTime = req.body.scheduledFor; // e.g. "27-05-2025 16:30"
const utcTime = moment.tz(istTime, "DD-MM-YYYY HH:mm", "Asia/Kolkata").utc().toDate();

    // Create and save the scheduled post
    const newPost = new ScheduledPost({
      createdBy: userId,
      content,
      platforms: selectedPlatformIds,
      scheduledFor:utcTime,
      imageUrls,
      videoUrls,
      audioUrls,
    });

    await newPost.save();

// Now save and send only valid selected platforms

    // // Send each platform's data to Pabbly
    // for (const platform of selectedPlatformsDetails) {
    //   await sendToPabblyPost({
    //     postId: newPost._id,
    //     content,
    //     scheduledFor,
    //     platform: {
    //       name: platform.platformName,
    //       platformId: platform._id,
    //     },
    //     media: {
    //       images: imageUrls,
    //       videos: videoUrls,
    //       audios: audioUrls,
    //     },
    //     createdBy: userId,
    //   });
    // }

    return res.status(201).json({
      message: "Scheduled post created and store in cron",
      post: newPost,
    });

  } catch (err) {
    console.error("Error creating scheduled post:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};



module.exports = { createScheduledPost };







getAllScheduledPosts = async (req, res) => {
  try {

    const userId = req.user._id || req.user.id;
    console.log("UserId from get",userId);
   // const userId=req.user._id || req.id;
    console.log(userId);
    
      if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // const posts = await ScheduledPost.find().sort({ scheduledFor: -1 }); // latest first
     const posts = await ScheduledPost.find({ createdBy: userId }).sort({ scheduledFor: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

const getScheduledPostById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const posts = await ScheduledPost.find({ createdBy: userId });

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ error: "No scheduled posts found for this user" });
    }

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching scheduled posts by user ID:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

// const updateScheduledPost = async (req, res) => {
//   try {
//     const userId = req.user._id || req.user.id;
//     const { postId } = req.params;

//     console.log("userId", userId);
//     console.log("postId", postId);

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//   return res.status(400).json({ message: 'Invalid post ID' });
// }

//     // const post = await ScheduledPost.findById(postId);
//     const post = await ScheduledPost.findOne({ _id: postId, createdBy: userId });

//     if (!post) return res.status(404).json({ error: "Post not found" });
//     console.log("post from db", post);

//     if (post.createdBy.toString() !== userId.toString()) {
//       return res.status(403).json({ error: "Unauthorized" });
//     }

//     const { content, scheduledFor, platforms } = req.body;
//     if (content) post.content = content;
//     if (scheduledFor) post.scheduledFor = scheduledFor;
//     if (platforms) post.platforms = platforms;

//     const files = req.files || [];
//     let updatedVideoUrls = [...post.videoUrls];
//     let updatedImageUrls = [...post.imageUrls];

//     const newVideoFiles = files.filter((file) =>
//       file.mimetype.startsWith("video/")
//     );
//     if (newVideoFiles.length > 0) {
//       const newVideoUrls = newVideoFiles.map(
//         (file) =>
//           `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
//       );

//       newVideoUrls.forEach((url) => {
//         if (!updatedVideoUrls.includes(url)) {
//           updatedVideoUrls.push(url);
//         }
//       });
//     }

//     const newImageFiles = files.filter((file) =>
//       file.mimetype.startsWith("image/")
//     );
//     if (newImageFiles.length > 0) {
//       const newImageUrls = newImageFiles.map(
//         (file) =>
//           `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
//       );

//       newImageUrls.forEach((url) => {
//         if (!updatedImageUrls.includes(url)) {
//           updatedImageUrls.push(url);
//         }
//       });
//     }

//     post.videoUrls = updatedVideoUrls;
//     post.imageUrls = updatedImageUrls;

//     await post.save();
//     res.status(200).json({ message: "Post updated successfully", post });
//   } catch (err) {
//     console.error("Update error:", err);
//     res
//       .status(500)
//       .json({ error: "Internal server error", details: err.message });
//   }
// };




// const updateScheduledPost = async (req, res) => {
//   try {
//     const userId = req.user._id || req.user.id;
//     console.log("UserId from update",userId);
    
//     const { postId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ message: 'Invalid post ID' });
//     }

//     const post = await ScheduledPost.findOne({ _id: postId, createdBy: userId });

//     if (!post) return res.status(404).json({ error: "Post not found" });

//     if (post.createdBy.toString() !== userId.toString()) {
//       return res.status(403).json({ error: "Unauthorized" });
//     }

//     const { content, scheduledFor, platforms } = req.body;
//     if (content) post.content = content;
//     if (scheduledFor) post.scheduledFor = scheduledFor;
//     if (platforms) post.platforms = platforms;

//     const files = req.files || [];
//     let updatedVideoUrls = [...post.videoUrls];
//     let updatedImageUrls = [...post.imageUrls];


//     for(const file of files){
//      if (!file?.buffer) {
//         console.error("Missing buffer for file:", file?.originalname);
//         continue; // Skip file if buffer not found
//       }
    

//     // const newVideoFiles = files.filter(file => file.mimetype.startsWith("video/"));
//     // if (newVideoFiles.length > 0) {
//     //   const newVideoPaths = newVideoFiles.map(file => `video/${file.filename}`);
//     //   newVideoPaths.forEach(path => {
//     //     if (!updatedVideoUrls.includes(path)) {
//     //       updatedVideoUrls.push(path);
//     //     }
//     //   });
//     // }

//     // const newImageFiles = files.filter(file => file.mimetype.startsWith("image/"));
//     // if (newImageFiles.length > 0) {
//     //   const newImagePaths = newImageFiles.map(file => `image/${file.filename}`);
//     //   newImagePaths.forEach(path => {
//     //     if (!updatedImageUrls.includes(path)) {
//     //       updatedImageUrls.push(path);
//     //     }
//     //   });
//     // }

//     // post.videoUrls = updatedVideoUrls;
//     // post.imageUrls = updatedImageUrls;



//      const fileName = path.parse(file.originalname).name;
//       const publicId = `${Date.now()}-${fileName}`;
//       const folder = "LMS/scheduledPosts"; // your Cloudinary folder

//       const result = await uploadOnCloudinary(file.buffer, publicId, folder);

//       if (!result?.secure_url) {
//         console.error("Failed to upload file:", file.originalname);
        
//       }

//       if (file.mimetype.startsWith("image/")) {
//         updatedImageUrls.push(result.secure_url);
//       } else if (file.mimetype.startsWith("video/")) {
//         updatedVideoUrls.push(result.secure_url);
//       }
//       // } else if (file.mimetype.startsWith("audio/")) {
//       //   updatedAudioUrls.push(result.secure_url);
//       // }
    

//     post.videoUrls = updatedVideoUrls;
//     post.imageUrls = updatedImageUrls;
//     //post.audioUrls = updatedAudioUrls; 
//     }
//     await post.save();
//     res.status(200).json({ message: "Post updated successfully", post });
//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({ error: "Internal server error", details: err.message });
//   }
// };









const updateScheduledPost = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const postId = req.params.postId;
    console.log("req params",req.params);
    
    console.log("postId",postId);
    
    const { content, scheduledFor, selectedPlatformIds } = req.body;

    if (!Array.isArray(selectedPlatformIds) || selectedPlatformIds.length === 0) {
      return res.status(400).json({ error: "selectedPlatformIds must be a non-empty array" });
    }

    const platformDoc = await Platform.findOne({ user: userId });
    const allPlatforms = platformDoc?.platforms || [];

    const validPlatforms = allPlatforms.filter(p => p.isValid);
    if (validPlatforms.length === 0) {
      return res.status(400).json({ error: "No valid platforms found for user" });
    }

    const validPlatformIds = validPlatforms.map(p => p._id.toString());
    const invalidIds = selectedPlatformIds.filter(id => !validPlatformIds.includes(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ error: "Invalid or unverified platform IDs selected" });
    }

    const files = Array.isArray(req.files) ? req.files : Object.values(req.files || {});
    const imageUrls = [], videoUrls = [], audioUrls = [];

    for (const file of files) {
      if (!file?.buffer) continue;
      const fileName = path.parse(file.originalname).name;
      const publicId = `${Date.now()}-${fileName}`;
      const folder = "LMS/scheduledPosts";
      const result = await uploadOnCloudinary(file.buffer, publicId, folder);

      if (!result?.secure_url) continue;
      if (file.mimetype.startsWith("image/")) imageUrls.push(result.secure_url);
      else if (file.mimetype.startsWith("video/")) videoUrls.push(result.secure_url);
      else if (file.mimetype.startsWith("audio/")) audioUrls.push(result.secure_url);
    }

    const selectedPlatformsDetails = validPlatforms.filter(p =>
      selectedPlatformIds.includes(p._id.toString())
    );

    const updatedPost = await ScheduledPost.findByIdAndUpdate(
      postId,
      {
        content,
        platforms: selectedPlatformIds,
        scheduledFor,
        ...(imageUrls.length && { imageUrls }),
        ...(videoUrls.length && { videoUrls }),
        ...(audioUrls.length && { audioUrls }),
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Scheduled post not found" });
    }

    for (const p of selectedPlatformsDetails) {
      const platformId = p._id || p.platformId || "";

      await sendToPabblyPost({
        postId: updatedPost._id,
        content,
        scheduledFor,
        platform: {
          name: p.platformName,
          platformId,
        },
        media: {
          images: updatedPost.imageUrls || [],
          videos: updatedPost.videoUrls || [],
          audios: updatedPost.audioUrls || [],
        },
        createdBy: userId,
      });
    }

    res.status(200).json({
      message: "Scheduled post updated and sent to Pabbly successfully",
      post: updatedPost,
    });

  } catch (err) {
    console.error("Error updating scheduled post:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};



const deleteScheduledPost = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { postId } = req.params;

    console.log("userId", userId);
    console.log("postId", postId);

    const post = await ScheduledPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await ScheduledPost.findByIdAndDelete(postId);

    res.status(200).json({ message: "Scheduled post deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

module.exports = {
  createScheduledPost,
  getAllScheduledPosts,
  getScheduledPostById,
  updateScheduledPost,
  deleteScheduledPost,
};



