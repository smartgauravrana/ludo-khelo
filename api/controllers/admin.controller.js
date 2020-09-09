const { exec } = require('child_process');
const path = require('path');
const { ErrorResponse } = require("../../utils");
const { asyncHandler } = require("../../middlewares");

module.exports.exportUsersCsv = asyncHandler((req, res, next) => {
    const {emails} = req.body;
    if(!emails)
        return next(new ErrorResponse("Emails is required!", 400));
    let toEmails = emails.split(",").map(e => e.trim()).join(" ");
    exec(`node ${path.resolve('jobs', 'usersExport.js')} ${toEmails}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
      
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
      
        console.log(`stdout:\n${stdout}`);
      });
    res.send({success: true});
})