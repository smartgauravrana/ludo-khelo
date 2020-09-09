const nodemailer = require("nodemailer");

async function sendMail(emailRequest) {

  const toEmails = emailRequest.to.join(" ");

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID, 
      pass: process.env.MAIL_PWD, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Ludo-noreply 👻" <${process.env.MAIL_ID}>`, // sender address
    to: toEmails, // list of receivers
    subject: emailRequest.subject, // Subject line
    text: emailRequest.text, // plain text body
    html: emailRequest.html, // html body,
    attachments: emailRequest.attachments
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports.sendMail = sendMail