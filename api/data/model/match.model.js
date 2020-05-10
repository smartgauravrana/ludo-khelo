const mongoose = require("mongoose");
const { Schema } = mongoose;

const { MATCH_STATUS } = require("../../../constants");

const screenshotSchema = new Schema({
  url: { type: String, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: "users" }
});

const matchSchema = new Schema({
  amount: { type: Number, required: true },
  status: { type: String, default: MATCH_STATUS.created },
  isOfficial: { type: Boolean, default: false },
  joinee: { type: Schema.Types.ObjectId, ref: "users" },
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  winner: { type: Schema.Types.ObjectId, ref: "users" },
  roomId: { type: String },
  resultId: { type: Schema.Types.ObjectId, ref: "users" },
  screenshots: [screenshotSchema],
  createdOn: Date
});

mongoose.model("matches", matchSchema);
