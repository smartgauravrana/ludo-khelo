const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: [true, "Please add name"] },
  username: { type: String, required: [true, "Please add username"] },
  phone: { type: String, required: [true, "Please add phone"] },
  password: {
    type: String,
    required: [true, "Please add password"],
    select: false
  },
  verified: { type: Boolean, default: false },
  chips: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  matchInProgress: { type: Number, default: 0 },
  salt: { type: String, select: false }
});

mongoose.model("users", userSchema);
