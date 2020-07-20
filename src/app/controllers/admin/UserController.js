const User = require("../../models/User");

module.exports = {
  async list(req, res) {
    const results = await User.listAll();
    const users = results.rows;

    return res.render("admin/users/list.njk", { users });
  },
  create(req, res) {
    return res.render("admin/users/create.njk");
  },
  async edit(req, res) {
    const id = req.params.id;
    const user = await User.findOne({ where: { id } });

    return res.render("admin/users/edit.njk", { user });
  },
  async post(req, res) {
    const { name, email, is_adm = false } = req.body;

    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "is_adm") {
        return res.send("Please, fill all fields!");
      }
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.render("admin/users/create.njk", {
        user: req.body,
        error: "Outro usuário já está utilizando este email.",
      });
    }

    await User.create({ name, email, is_adm });
    return res.redirect(`/admin/users`);
  },
  async put(req, res) {
    const { name, email, is_adm = false, id } = req.body;

    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "is_adm") {
        return res.send("Please, fill all fields!");
      }
    }

    const user = await User.findOne({ where: { email } });
    if (user && user.id != id) {
      return res.render("admin/users/edit.njk", {
        user: req.body,
        error: "Outro usuário já está utilizando este email.",
      });
    }

    await User.update({ name, email, is_adm, id });
    return res.redirect(`/admin/users`);
  },
  async delete(req, res) {
    const id = req.body.id;

    await User.delete({ id });

    return res.redirect("/admin/users");
  },
};
