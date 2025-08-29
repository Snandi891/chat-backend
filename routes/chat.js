const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message"); // ✅ Import Message model

// @route   POST /chat/start
router.post("/start", async (req, res) => {
  try {
    const { senderId, receiverEmail } = req.body;

    if (!senderId || !receiverEmail) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const receiver = await User.findOne({
      email: receiverEmail.toLowerCase().trim(),
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let chat = await Chat.findOne({
      users: { $all: [senderId, receiver._id] },
    });

    if (!chat) {
      chat = await Chat.create({ users: [senderId, receiver._id] });
    }

    chat = await chat.populate("users", "username email");
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in /chat/start:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ NEW ROUTE: Get messages for a chat
router.get("/messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

module.exports = router;
