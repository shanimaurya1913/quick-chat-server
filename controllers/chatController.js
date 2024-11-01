const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Chat = require("../models/chat");

router.post("/create-new-chat", authMiddleware, async (req, res) => {
  try {
    const chat = await new Chat(req.body);
    const saveChat = await chat.save();

    res.status(201).send({
      success: true,
      message: "Chat created successfully",
      data: saveChat,
    });
  } catch (error) {
    console.log("abc", error);

    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/get-all-chat", authMiddleware, async (req, res) => {
  try {
    const allChats = await Chat.find({ members: { $in: req.body.userId } });

    res.status(200).send({
      success: true,
      message: "Chat fetched successfully",
      data: allChats,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
