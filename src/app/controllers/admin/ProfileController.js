const User = require("../../models/User");

module.exports = {
  async index(req, res) {
    const id = req.session.userId;
    const user = await User.findOne({ where: { id } });
    return res.render("admin/profile/edit.njk", { user });
  },
  put(req, res) {},
};
