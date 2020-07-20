const User = require("../models/User");
const { compare } = require("bcryptjs");

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "" && key != "is_adm") {
      return res.send("Please, fill all fields!");
    }
  }

  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (user) {
    return res.render("admin/users/create.njk", {
      user: req.body,
      error: "Email já cadastrado",
    });
  }
  next();
}

module.exports = {
  post,
};
