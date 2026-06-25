const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {},
  {
    strict: false,
  }
);

const User = mongoose.model("User", usersSchema, "user" );

module.exports = User;