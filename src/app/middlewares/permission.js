const User = require("../models/User");

async function isAdmin(req, res, next) {
  if (!req.session.userIsAdmin) {
    const id = req.session.userId;
    const user = await User.findOne({ where: { id } });
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
