const express = require('express');
const router=express.Router();
const {
    login,
    verifyToken
}=require("../middlewares/auth.js");

router.post('/login',login);
router.get('/verify',verifyToken);

module.exports = router;