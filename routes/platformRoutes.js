const express = require('express');

const router=express.Router();

const{
    createPlatform,
    getUserPlatforms
}=require("../controller/platformController.js");
const {verifyToken}=require("../middlewares/auth.js");

const Platform=require("../models/Platform.js")

router.post("/create-platform",verifyToken,createPlatform);
router.get("/get-user-platforms",verifyToken, getUserPlatforms);


module.exports=router;