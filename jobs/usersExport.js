const path = require('path');
const mongoose = require("mongoose");
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');

const mailer = require("../services/mailer");

require("dotenv").config({ path: path.resolve(process.cwd(), '../.env') });

// db related stuff
require("../api/data/db");
require("../api/data/model/user.model");

const User = mongoose.model("users");

const generateCsv = async () => {
    const users = await User.find({}).select('-_id name phone username chips');
    console.log(users);
    const data = users.map(u => u.toObject());
    const csv = new ObjectsToCsv(data);
    // Save to file:
    const filePath = './users.csv'
    await csv.toDisk(filePath);
    const emailInfo = {
        to: mailAddress,
        subject: "Ludo Users Data",
        text: "Hello Admin, Please look at attachment for data file :)",
        attachments: [{
                filename: 'users.csv',
                path: filePath // stream this file
        }]
    }
    await mailer.sendMail(emailInfo);

    // deleting file
    try {
        fs.unlinkSync(filePath)
        //file removed
      } catch(err) {
        console.error(err)
      } finally{
          process.exit(0);
      }

}

// checking for mails
const [a, b, ...mailAddress] = process.argv;

generateCsv();

// name, username, phone, chips
 