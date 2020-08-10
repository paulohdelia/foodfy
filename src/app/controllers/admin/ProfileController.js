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

    try {
      await User.update(id, { name });

      return res.render("admin/profile/edit.njk", {
        user: req.body,
        success: "Perfil atualizado com sucesso.",
      });
    } catch {
      return res.render("admin/profile/edit.njk", {
        user: req.body,
        error: "Erro inesperado ao atualizar o perfil. Por favor, tente novamente.",
      });
    }

    return res.redirect("/admin/profile");
  },
};
