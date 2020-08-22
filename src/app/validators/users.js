const User = require('../models/User');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "" && key != "is_admin") {
      return {
        user: {
          ...body,
          is_admin: Boolean(body.is_admin)
        },
        error: "Por favor, preencha todos os campos",
      };
    }
  }
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render("admin/users/create.njk", fillAllFields);
  }

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render("admin/users/edit.njk", fillAllFields);
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

// I can't name it to "delete"
async function deleteOne(req, res, next) {
  const id = req.body.id;

  if (req.session.userId == id) {
    const users = await User.findAll();

    return res.render("admin/users/list.njk", {
      users,
      error: "Você não pode excluir a si mesmo!",
    });
  }

  next();
}

module.exports = {
  post,
  put,
  deleteOne,
}