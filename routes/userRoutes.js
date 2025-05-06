const express = require('express');
const router=express.Router();
const{
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}=require("../controller/userController");
const { verifyToken } = require("../middlewares/auth");
const User = require('../models/User');



router.post("/create",createUser);
router.get("/getAllUser",getAllUser);
router.get("/byId",verifyToken,getUserById);
router.put("/updateUser",verifyToken,updateUser);
router.delete("/deleteUser",verifyToken,deleteUser);


module.exports=router;