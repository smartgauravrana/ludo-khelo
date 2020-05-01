const mongoose = require("mongoose");
const { Schema } = mongoose;

const sellRequestSchema = new Schema({
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  status: { type: String, required: true }
});

mongoose.model("sellRequests", sellRequestSchema);
