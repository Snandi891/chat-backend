const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String },
  avatar: String,
  profileImage: { type: String }, // ✅ Add this line
});

module.exports = mongoose.model("User", UserSchema);
