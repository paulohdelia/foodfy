const User = require("../models/User");
const { compare } = require("bcryptjs");

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: "Por favor, preencha todos os campos.",
      };
    }
  }
}

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "" && key != "is_admin") {
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

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({ where: { id } });

  if (!user) {
    return res.render("user/register", {
      error: "Usuário não encontrado!",
    });
  }

  req.user = user;

  next();
}

async function update(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render("admin/profile/edit.njk", {
      user: req.body,
      error: "Preencha todos os campos.",
    });
  }

  const { id, password } = req.body;

  if (!password) {
    return res.render("admin/profile/edit.njk", {
      user: req.body,
      error: "Coloque sua senha para atualizar seu cadastro.",
    });
  }

  const user = await User.findOne({ where: { id } });

  const passed = await compare(password, user.password);

  if (!passed) {
    return res.render("admin/profile/edit.njk", {
      user: req.body,
      error: "Senha incorreta.",
    });
  }

  req.user = user;

  next();
}

module.exports = {
  post,
  show,
  update,
};
