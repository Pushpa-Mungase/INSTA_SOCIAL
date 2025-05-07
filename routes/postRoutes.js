const express=require("express");
const router=express.Router();
const upload = require('../config/multerConfig');


const {
    createScheduledPost

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


module.exports=router;