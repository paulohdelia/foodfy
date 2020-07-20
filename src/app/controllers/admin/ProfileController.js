const User = require("../../models/User");

module.exports = {
  async index(req, res) {
    const id = req.session.userId;
    const user = await User.findOne({ where: { id } });
    return res.render("admin/profile/edit.njk", { user });
  },
  async put(req, res) {
    const { name, email } = req.body;
    const id = req.session.userId;

    await User.update(id, { name, email });

    return res.redirect("/admin/profile");
  },
};
