const mongoose = require("mongoose");
const { Schema } = mongoose;

const { getTime } = require("../../../utils");

const sellRequestSchema = new Schema({
  amount: { type: Number, required: [true, "Please add amount"] },
  phone: { type: String, required: [true, "Please add phone number"] },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  status: { type: String, required: [true, "Please add status"] },
  createdAt: Date
});

// saving created Date
sellRequestSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = getTime();
  }
  next();
});

mongoose.model("sellRequests", sellRequestSchema);
