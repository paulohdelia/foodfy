const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "56aedafa542024",
    pass: "8b9f51cb7d24dc",
  },
});
