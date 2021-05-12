const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { getTime } = require("../../../utils");

const transactionSchema = new Schema({
  orderId: {
    type: String,
    required: [true, "Order Id is required"]
  },
  amount: { type: String, required: [true, "Amount is required"] },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  createdAt: Date,
  status: { type: String, default: 'NOT_STARTED'},
  modifiedAt: Date
});

transactionSchema.pre("save", function (next) {
    if (!this.createdAt) {
      this.createdAt = getTime();
    }
    this.modifiedAt = getTime();
    next();
  });

module.exports = mongoose.model("transactions", transactionSchema);
