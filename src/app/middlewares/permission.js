const User = require("../models/User");

async function isAdmin(req, res, next) {
  const id = req.session.userId;
  const user = await User.findOne({ where: { id } });

  req.session.userIsAdmin = user.is_admin;

  if (!req.session.userIsAdmin) {
    return res.render("admin/profile/edit.njk", {
      user,
      error: "Apenas administradores têm acesso a essa área.",
    });
  }
  next();
}

module.exports = {
  isAdmin,
};
