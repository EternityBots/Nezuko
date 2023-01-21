const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  id: { type: String, require: true, unique: true },
  name: { type: String },
});
const user = mongoose.model("User", userSchema);
module.exports = user;
