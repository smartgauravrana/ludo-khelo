const mongoose = require("mongoose");
const randomString = require('random-string');
const User = mongoose.model("users");

const generateReferCode = async () => {
    while (1){
        const code = randomString({
            length: 6
        });
        console.log("code: ", code)
        const user = await User.findOne({ referCode: code});
        if(!user){
            return code.toUpperCase();
        }
    }
}

module.exports = {
    generateReferCode
} 