const mongoose = require("mongoose");
const { Schema } = mongoose;

const sellRequestSchema = new Schema({
  amount: { type: Number, required: [true, "Please add amount"] },
  phone: { type: String, required: [true, "Please add phone number"] },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  status: { type: String, required: [true, "Please add status"] }
});

mongoose.model("sellRequests", sellRequestSchema);
