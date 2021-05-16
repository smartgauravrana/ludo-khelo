require("dotenv").config();

// db related stuff
const mongoose = require("mongoose");
require("./api/data/db");
require("./api/data/model/user.model");

const refService = require("./services/referralService");
// require("./api/data/model/sellRequest.model");
// require("./api/data/model/setting.model");

// const Match = mongoose.model("matches");
const User = mongoose.model("users");

// const deleteData = async () => {
//   try {
//     await Match.deleteMany();
//     console.log("Data Destroyed...");
//     // resetting user progress
//     await User.updateMany({}, { matchInProgress: 0 });
//     process.exit();
//   } catch (err) {
//     console.error(err);
//   }
// };

// generating refer code
async function generateRefercode(){
  let i=1;
  while(1){
    const users = await User.find({referCode: { $exists: false }});
    if(users){
      for(let user of users){
        console.log("user " + i +" -------------")
        const code = await refService.generateReferCode();
        user.referCode  = code.toUpperCase();
        await user.save();
        i++;
      }
    } else{
      console.log("loop breaked ---------- ", i)
      break;
    }
  }
}


console.log("process ", process.argv[2]);
generateRefercode();
// if (process.argv[2] === "-d") {
//   deleteData();
// }
