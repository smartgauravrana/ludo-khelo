const mongoose = require("mongoose");
const { Schema } = mongoose;

const { MATCH_STATUS } = require("../../../constants");

// const resultSchema = new Schema({
//   postedBy: { type: Schema.Types.ObjectId },
//   imgUrl: { type: String }
// });

// const resultPostedSchema = new Schema({
//   won: [resultSchema],
//   lose: [resultSchema],
//   cancel: [resultSchema]
// });

const matchSchema = new Schema({
  amount: { type: Number, required: true },
  status: { type: String, default: MATCH_STATUS.created },
  isOfficial: { type: Boolean, default: false },
  joinee: { type: Schema.Types.ObjectId, ref: "users" },
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
  winner: { type: Schema.Types.ObjectId, ref: "users" },
  roomId: { type: String },
  resultId: { type: Schema.Types.ObjectId, ref: "users" },
  resultsPosted: {
    type: Object,
    default: {
      won: [],
      lost: [],
      cancel: []
    }
  },
  createdOn: Date
});

mongoose.model("matches", matchSchema);
