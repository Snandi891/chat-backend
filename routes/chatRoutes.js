const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

// ✅ 1. Start a new chat or return existing
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

    // Check if chat exists
    let chat = await Chat.findOne({
      users: { $all: [senderId, receiver._id] },
    });

    if (!chat) {
      chat = await Chat.create({ users: [senderId, receiver._id] });
    }

    chat = await chat.populate("users", "username email profileImage");
    res.status(200).json(chat);
  } catch (err) {
    console.error("Start chat error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ 2. Get messages for a chat
router.get("/messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 3. Get user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get user error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 4. Get all chats for a user
router.get("/:userId", async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.params.userId }).populate(
      "users",
      "username email profileImage"
    );
    res.json(chats);
  } catch (err) {
    console.error("Fetch chats error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 5. Delete a chat
router.delete("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndDelete(chatId);
    await Message.deleteMany({ chatId });

    res.status(200).json({ message: "Chat and messages deleted" });
  } catch (err) {
    console.error("Delete chat error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
