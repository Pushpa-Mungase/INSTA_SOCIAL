const express = require("express");
const { handlePabblyVerification,handlePostVerification } = require("../controller/webhookController.js");

const router = express.Router();
router.post("/pabbly/verify", handlePabblyVerification);
router.post("/post/verify", handlePostVerification);

module.exports = router;
