const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  chips: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  salt: String
});

mongoose.model("users", userSchema);
