const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);

module.exports = { User };
