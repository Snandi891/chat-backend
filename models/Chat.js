const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, default: false },
    name: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
