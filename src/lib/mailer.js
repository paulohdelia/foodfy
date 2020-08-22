const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c9e4263811fcdc",
    pass: "458a82f4969d67"
  }
});
