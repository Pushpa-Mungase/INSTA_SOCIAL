const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY; // Fetch secret key from environment variables

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res
          .status(400)
          .json({ status: false, message: "EMAIL_PASSWORD_REQUIRED" });
      }
  
      // Find the user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "INVALID_CREDENTIALS",
        });
      }
  
      // Compare the password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          status: false,
          message: "INVALID_CREDENTIALS",
        });
      }
  
      // Generate token
      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "3h" });
  
      const profile = {
        id: user._id,
        name: user.name,
        email: user.email,
      };
  
      return res.status(200).json({
        status: true,
        message: "LOGIN_SUCCESSFUL",
        token,
        data: profile,
      });
    } catch (error) {
      console.error(error); // Log error for debugging
      return res.status(500).json({ status: false, message: "ERROR_IN_LOGIN" });
    }
  };
  

exports.verifyToken = async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res
          .status(400)
          .send({ status: false, message: "TOKEN_EXPIRED" });
      }
  
      const userToken = token.split(" ")[1];
      const decodeToken = jwt.verify(userToken, SECRET_KEY);
  
      if (!decodeToken) {
        return res
          .status(403)
          .send({ status: false, message: "YOUR_NOT_AUTHORIZE" });
      }
  
      req.user = decodeToken;
    
      next();
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, message: "ERROR_VERIFING_TOKEN" });
    }
  };
  