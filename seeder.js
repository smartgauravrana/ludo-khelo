require("dotenv").config();

// db related stuff
const mongoose = require("mongoose");
require("./api/data/db");
require("./api/data/model/match.model");
require("./api/data/model/user.model");
// require("./api/data/model/sellRequest.model");
// require("./api/data/model/setting.model");

const Match = mongoose.model("matches");
const User = mongoose.model("users");

const deleteData = async () => {
  try {
    await Match.deleteMany();
    console.log("Data Destroyed...");
    // resetting user progress
    await User.updateMany({}, { matchInProgress: 0 });
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

console.log("process ", process.argv[2]);
if (process.argv[2] === "-d") {
  deleteData();
}
