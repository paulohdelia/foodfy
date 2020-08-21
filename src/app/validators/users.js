const User = require('../models/User');

async function put(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "" && key != "is_admin") {
      return res.render("admin/users/edit.njk", {
        user: {
          ...req.body,
          is_admin: Boolean(req.body.is_admin)
        },
        error: "Por favor, preencha todos os campos",
      });
    }
  }

  const user = await User.findOne({ where: { email: req.body.email } });
  // Existe um usuário?
  // Se sim, então o id dele é igual o do usuário atual?
  if (user && user.id != req.body.id) {
    return res.render("admin/users/edit.njk", {
      user: {
        ...req.body,
        is_admin: Boolean(req.body.is_admin)
      },
      error: "Outro usuário já está utilizando este email.",
    });
  }

  next();
}

module.exports = {
  put,
}