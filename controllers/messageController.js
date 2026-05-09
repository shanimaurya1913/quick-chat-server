const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Chat = require("../models/chat");
const Message = require("../models/message");

router.post("/new-message", authMiddleware, async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();

    const currentChat = await Chat.findOneAndUpdate(
      {
        _id: req.body.chatId,
      },
      {
        lastMessage: savedMessage._id,
        $inc: { unreadMessageCount: 1 },
      }
    );

    res.status(201).send({
      success: true,
      message: "Message send successfully",
      data: savedMessage,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-all-messages/:chatId", authMiddleware, async (req, res) => {
  try {
    const allMessages = await Message.find({
      chatId: req.params.chatId,
    }).sort({ createdAt: 1 });

    res.send({
      success: true,
      message: "Messages fetched successfully",
      data: allMessages,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
