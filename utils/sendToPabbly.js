const axios = require("axios");

module.exports = async function sendToPabbly(data) {
  await axios.post("https://connect.pabbly.com/workflow/sendwebhookfiledata/IjU3NjEwNTZmMDYzZjA0MzM1MjZmNTUzMSI_3D_pc/IjU3NjYwNTY4MDYzMjA0MzA1MjZkNTUzNTUxMzEi_pc", {
    platformName: data.platformName,
    userId: data.platformDetails.userId,
    password: data.platformDetails.password,
    userMongoId: data.user,
    platformId: data._id,
    callbackUrl: "http://127.0.0.1:8000/api/v1/api/webhook/pabbly/verify"
  });
  console.log("response send to pabbly");
  
};
