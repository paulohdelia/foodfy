const Chef = require("../models/Chef");

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "" && key != "removed_files" && key != "old_file_id") {
      return {
        recipe: body,
        error: "Por favor, preecha todos os campos.",
      };
    }
  }
}

function hasAtLeastOneImage(
  files,
  body = {
    removed_files: true,
  }
) {
  if (files.length == 0 && body.removed_files) {
    return {
      error: "Por favor, envie ao menos uma imagem",
    };
  }
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    const chefs = await Chef.getNames();
    return res.render("admin/recipe/create.njk", { ...fillAllFields, chefs });
  }

  const sendAtLeastOneImage = hasAtLeastOneImage(req.files);

  if (sendAtLeastOneImage) {
    const chefs = await Chef.getNames();
    return res.render("admin/recipe/create.njk", {
      ...sendAtLeastOneImage,
      chefs,
      recipe: req.body,
    });
  }

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    const chefs = await Chef.getNames();
    return res.render("admin/recipe/edit.njk", { ...fillAllFields, chefs });
  }

  const sendAtLeastOneImage = hasAtLeastOneImage(req.files, req.body);

  if (sendAtLeastOneImage) {
    const chefs = await Chef.getNames();
    return res.render("admin/recipe/edit.njk", {
      ...sendAtLeastOneImage,
      chefs,
      recipe: req.body,
    });
  }

  next();
}

module.exports = {
  post,
  put,
};
