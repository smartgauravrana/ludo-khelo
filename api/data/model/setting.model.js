const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  paytmNumber: {
    type: String,
    required: [true, "Paytm number is required"]
  },
  paytmMail: { type: String, default: "ludokhelo99@gmail.com", trim: true },
  supportNumber: {
    type: String,
    required: [true, "Suppoort number is required!"]
  }
});

module.exports = mongoose.model("settings", settingSchema);
