const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU", //don't change chadit✅
  description: "Generate a couple banner image using sender and random group member via Avatar Canvas API",
  commandCategory: "banner",
  usePrefix: true,
  usages: "pair",
  cooldowns: 5
};

module.exports.run = async function ({ event, api, Users }) {
  const { threadID, messageID, senderID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const botID = api.getCurrentUserID();
    const members = threadInfo.userInfo.filter(u => u.id !== senderID && u.id !== botID);

    if (members.length === 0) {
      return api.sendMessage("Please reply or mention someone......", threadID, messageID);
    }

    const randomUser = members[Math.floor(Math.random() * members.length)];
    const targetID = randomUser.id;

    const apiList = await axios.get(
      "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/refs/heads/main/SAHU-API.json"
    );

    const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;

    const res = await axios.post(
      `${AVATAR_CANVAS_API}/api`,
      { cmd: "pair", senderID, targetID },
      { responseType: "arraybuffer", timeout: 30000 }
    );

    const imgPath = path.join(__dirname, "cache", `pair_${senderID}_${targetID}.png`);
    fs.writeFileSync(imgPath, res.data);

    return api.sendMessage(
      {
        body: "~পারফেক্ট জুটি তোমাদের জন্য শুভকামনা রইল 🫶",
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );

  } catch (err) {
    return api.sendMessage("API Error Call me boss Ayan", threadID, messageID);
  }
};
