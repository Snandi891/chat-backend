const Message = require("../models/Message");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("send_message", async (data) => {
      const { chatId, senderId, text, image } = data;

      const message = new Message({
        chatId,
        senderId,
        text,
        image,
      });

      await message.save();

      io.to(chatId).emit("receive_message", {
        _id: message._id,
        chatId,
        senderId,
        text,
        image,
        createdAt: message.createdAt,
      });
    });

    socket.on("disconnect", () => {
      console.log("❎ Socket disconnected:", socket.id);
    });
  });
}

module.exports = setupSocket;
