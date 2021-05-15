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
    required: [true, "Support number is required!"]
  },
  websiteTitle: {
    type:String,
    time: true,
    required: [true, "Website title is required!"]
  },
  referralCommission: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

module.exports = mongoose.model("settings", settingSchema);
