const User = require("../../models/User");
const mailer = require("../../../lib/mailer");
const crypto = require("crypto");

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
    try {
      const { name, email, is_adm } = req.body;

      const token = crypto.randomBytes(20).toString("hex");
      const results = await User.create({
        name,
        email,
        is_adm,
        password: token,
      });
      const id = results.rows[0].id;

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(id, {
        reset_token: token,
        reset_token_expires: now,
      });

      await mailer.sendMail({
        to: email,
        from: "no-reply@foodfy.com.br",
        subject: "Senha de acesso Foodfy",
        html: `
          <h2>Bem vindo ao Foodfy</h2>
          <p>Este é seu link de acesso, click nele para registrar uma senha nova para seu usuário.</p>
          <p>
          <a href="http://localhost:5000/users/password-reset?token=${token}" target="_blank">
                Recuperar senha                
            </a>
            </p>      
      `,
      });

      return res.render("admin/users/create.njk", {
        success: "Usuário criado com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/users/create.njk", {
        user: req.body,
        error: "Erro inesperado, tente novamente!",
      });
    }
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

    await User.update(id, { name, email, is_admin: is_adm });
    return res.redirect(`/admin/users`);
  },
  async delete(req, res) {
    const id = req.body.id;

    await User.delete({ id });

    return res.redirect("/admin/users");
  },
};
