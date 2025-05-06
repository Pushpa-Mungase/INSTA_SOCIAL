const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER_CTR_MSG } = require("../constant message/constant");
//const logger=require('../logger/index');
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "yourSecretKeyHere";

exports.createUser = async (req, res) => {
  console.log("hit");

  try {
    const { name, email, password } = req.body;
    console.log("req.body:", req.body);

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: USER_CTR_MSG.ALL_FIELDS_ARE_REQUIRED });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: USER_CTR_MSG.EMAIL_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("savedUser:", savedUser);

    return res.status(201).json({
      status: true,
      message: USER_CTR_MSG.USER_CREATED_SUCCESSFULLY,
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: USER_CTR_MSG.ERROR_CREATING_USER });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find().populate();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: USER_CTR_MSG.ERROR_FETCHING_USERS,
    });
  }
};

exports.getUserById = async (req, res) => {
    console.log("req.user",req.user);
    
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate();

    if (!user) {
      return res.status(404).json({ error: USER_CTR_MSG.USER_NOT_FOUND });
    }

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: USER_CTR_MSG.ERROR_FETCHING_USER });
  }
};

exports.updateUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const { password, ...updateData } = req.body;
  
      // Handle password hashing if provided
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
  
      // Perform update
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password"); // Remove password from response
  
      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          error: USER_CTR_MSG.USER_NOT_FOUND,
        });
      }
  
      return res.status(200).json({
        status: true,
        message: "USER_UPDATED_SUCCESSFULLY",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        status: false,
        error: USER_CTR_MSG.ERROR_UPDATING_USER,
      });
    }
  };
  

exports.deleteUser = async (req, res) => {
  try {
    const userId=req.user.id;

    const deleteUser=await User.findByIdAndDelete(userId);
    if(!deleteUser)
    {
    
    return res.status(404).json({error:USER_CTR_MSG.USER_NOT_FOUND})
    }

    res.status(200).json({message:USER_CTR_MSG.USER_DELETED_SUCCESSFULLY});
  } catch (error) {
    res.status(500).json({
        error:USER_CTR_MSG.ERROR_DELETING_USER
    })
  }
};
