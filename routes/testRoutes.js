// routes/testRoutes.js
const express = require("express");
const router = express.Router();
const runScheduledPostCron = require("../cron/postScheduler"); // Adjust path if needed
// const {
//     scheduledPosts
// }=require("../cron/postScheduler");

// Trigger cron manually from Postman
router.get("/run-scheduler", runScheduledPostCron);

module.exports = router;
