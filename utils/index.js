const crypto = require("crypto");

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

function getPaytmDetails(text) {
  const amountRegex = /₹\s\d+/;
  const idRegex = /Transaction Id:\s\d+/;
  const [amountString] = text.match(amountRegex);
  const [idString] = text.match(idRegex);
  const amount = +amountString.split(" ").pop().trim();
  const transactionId = idString.split(" ").pop().trim();
  return { amount, transactionId };
}

module.exports = {
  validPassword,
  genPassword,
  getPaytmDetails
};
