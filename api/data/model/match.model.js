const mongoose = require("mongoose");
const { Schema } = mongoose;

const { MATCH_STATUS } = require("../../../constants");
const { genRewardAmount, getTime, getRefAmount } = require("../../../utils");

const User = mongoose.model("users");
const Setting = mongoose.model("settings");

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
  amount: { type: Number, required: [true, "Please add amount"] },
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
  winningAmount: { type: Number },
  createdAt: Date
});

// saving winning Amount from current logic
matchSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = getTime();
  }
  if (!this.winningAmount) {
    this.winningAmount = genRewardAmount(this.amount);
  }
  next();
});

// for referral amount system
matchSchema.post('findOneAndUpdate', async function() {
  const docToUpdate = await this.model.findOne(this.getQuery());
  console.log("match Updated: ", docToUpdate); 
  const winnerId = docToUpdate.winner;
  if(winnerId){
    const settings = await Setting.findOne();
    const referralPercentage = settings.referralCommission || 0;

    // user1 
    const user1 = await User.findById(docToUpdate.joinee);
    const user2 = await User.findById(docToUpdate.createdBy);
    const referrer1 = user1.referrer;
    const referrer2 = user2.referrer;

    if(referrer1)  {
      await User.findOneAndUpdate({phone: referrer1}, {
        $inc: { chips: getRefAmount(docToUpdate.amount, referralPercentage)}
      });
    }

    if(referrer2) {
      await User.findOneAndUpdate({phone: referrer2}, {
        $inc: { chips: getRefAmount(docToUpdate.amount, referralPercentage)}
      });
    }

    // const winner = await User.findById(winnerId);
    // const referrerId = winner.referrer; // referrerId is phone no
    // console.log("parentId: ", referrerId);
    // if(referrerId){
    //   await User.findOneAndUpdate({phone: referrerId}, {
    //     $inc: { chips: getRefAmount(docToUpdate.amount, referralPercentage)}
    //   });
    // }
  }
});

mongoose.model("matches", matchSchema);
