const express=require("express");
const router=express.Router();
const upload = require('../config/multerConfig');


const {
    createScheduledPost,
    getAllScheduledPosts,
    getScheduledPostById,
    updateScheduledPost,
    deleteScheduledPost

}=require('../controller/scheduledPostController');

const { verifyToken } = require("../middlewares/auth");
const Post=require("../models/Post");

//router.post("/scheduled-posts", verifyToken, createScheduledPost);

router.post(
  '/scheduled-posts',
  verifyToken,
  upload.array('media', 10), // 'media' should match the name in your form-data
  createScheduledPost
);

router.get('/get-scheduled-posts',verifyToken,getAllScheduledPosts);
router.get('/get-scheduled-posts-byId' , verifyToken, getScheduledPostById);
router.put('/update-scheduled-post/:postId' , verifyToken, upload.array('media', 10), updateScheduledPost);
router.delete('/delete-scheduled-post/:postId' , verifyToken, deleteScheduledPost);


module.exports=router;