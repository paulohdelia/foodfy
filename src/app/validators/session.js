const User = require("../models/User");
const { compare, hash } = require("bcryptjs");

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("session/login", {
      user: req.body,
      error: "Usuário não cadastrado!",
    });
  }

  const passed = await compare(password, user.password);

  if (!passed) {
    return res.render("session/login", {
      user: req.body,
      error: "Senha incorreta.",
    });
  }

  req.user = user;

  next();
}

async function forgot(req, res, next) {
  const { email } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user)
      return res.render("session/forgot-password", {
        usser: req.body,
        error: "Email não cadastrado!",
      });

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user)
      return res.render("session/reset-password", {
        usser: req.body,
        token,
        error: "Email não encontrado na nossa base de dados!",
      });

    if (password != passwordRepeat) {
      return res.render("session/reset-password", {
        user: req.body,
        token,
        error: "As senhas estão diferentes.",
      });
    }

    if (token !== user.reset_token) {
      return res.render("session/reset-password", {
        user: req.body,
        token,
        error: "Token inválido! Solicite uma nova recuperação de senha.",
      });
    }

    let now = new Date();
    now = now.setHours(now.getHours());

    if (now > user.reset_token_expires) {
      return res.render("session/reset-password", {
        user: req.body,
        error: "Token expirou! Solicite uma nova recuperação de senha.",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  login,
  forgot,
  reset,
};
