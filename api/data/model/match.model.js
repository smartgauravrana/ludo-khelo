const mongoose = require("mongoose");
const { Schema } = mongoose;

const { MATCH_STATUS } = require("../../../constants");

const matchSchema = new Schema({
  amount: { type: Number, required: true },
  status: { type: String, default: MATCH_STATUS.created },
  isOfficial: { type: Boolean, default: false },
  joinee: { type: Schema.Types.ObjectId },
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  winner: { type: Schema.Types.ObjectId },
  createdOn: Date
});

mongoose.model("matches", matchSchema);
