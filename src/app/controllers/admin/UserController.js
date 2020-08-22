const User = require("../../models/User");
const mailer = require("../../../lib/mailer");
const crypto = require("crypto");

module.exports = {
  async list(req, res) {
    try {
      const users = await User.findAll();
      return res.render("admin/users/list.njk", { users });
    } catch (error) {
      console.error(error);
    }
  },
  create(req, res) {
    return res.render("admin/users/create.njk");
  },
  async edit(req, res) {
    try {
      const user = await User.find(req.params.id);
      return res.render("admin/users/edit.njk", { user });
    } catch (error) {
      console.error(error);
    }
  },
  async post(req, res) {
    try {
      const { name, email, is_admin = false } = req.body;

      const token = crypto.randomBytes(20).toString("hex");
      const id = await User.create({
        name,
        email,
        is_admin,
        password: token,
      });

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
          <a href="http://localhost:5000/session/reset-password?token=${token}" target="_blank">
                Nova senha                
            </a>
            </p>      
      `,
      });

      const users = await User.findAll();
      return res.render("admin/users/list.njk", {
        users,
        success: "Usuário criado com sucesso!",
      });
    } catch (err) {
      return res.render("admin/users/create.njk", {
        user: req.body,
        error: "Erro inesperado, tente novamente!",
      });
    }
  },
  async put(req, res) {
    try {
      const { name, email, is_admin = false, id } = req.body;

      await User.update(id, { name, email, is_admin: is_admin });
      const users = await User.findAll();
      return res.render("admin/users/list.njk", {
        users,
        success: "Usuário editado com sucesso!",
      });
    } catch {
      return res.render("admin/users/edit.njk", {
        user: req.body,
        error: "Erro inesperado, tente novamente!",
      });
    }
  },
  async delete(req, res) {
    try {
      const id = req.body.id;

      await User.delete(id);

      const users = await User.findAll();
      return res.render("admin/users/list.njk", {
        users,
        success: "Usuário removido com sucesso!",
      });
    } catch (error) {
      const users = await User.findAll();
      return res.render("admin/users/list.njk", {
        users,
        error: "Erro inesperado, tente novamente!",
      });
    }
  },
};
