const crypto = require("crypto");
const ErrorResponse = require("./errorResponse");

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash
  };
}

function genRewardAmount(challengeAmount) {
  let reward;
  if (challengeAmount < 250) {
    // charge 10%
    reward = challengeAmount - challengeAmount * 0.1;
  }
  if (challengeAmount >= 250 && challengeAmount <= 500) {
    // charge Rs.25
    reward = challengeAmount - 25;
  }

  if (challengeAmount > 500) {
    // charge 5%
    reward = challengeAmount - challengeAmount * 0.05;
  }

  return challengeAmount + Math.floor(reward);
}

function getPaytmDetails(text) {
  const amountRegex = /₹\s\d+/;
  const idRegex = /Transaction Id:\s\d+/;
  const [amountString] = text.match(amountRegex);
  const [idString] = text.match(idRegex);
  const amount = +amountString.split(" ").pop().trim();
  const transactionId = idString.split(" ").pop().trim();
  return { amount, transactionId };
}

const isEmpty = value =>
  value === null ||
  value === undefined ||
  (Array.isArray(value) && !value.length) ||
  (typeof value === "object" && !Object.keys(value).length) ||
  (typeof value === "string" && !value.trim().length);

const isResultPosted = (resultsPosted, userId) => {
  const isResultPosted = !!Object.keys(resultsPosted).find(key =>
    resultsPosted[key].find(
      result => result.postedBy.toString() === userId.toString()
    )
  );
  return isResultPosted;
};

const isParticipant = (match, userId) => {
  return (
    match.createdBy._id.toString() === userId.toString() ||
    (match.joinee.toString() &&
      match.joinee._id.toString() === userId.toString())
  );
};

module.exports = {
  validPassword,
  genPassword,
  getPaytmDetails,
  isEmpty,
  genRewardAmount,
  ErrorResponse,
  isResultPosted,
  isParticipant
};
