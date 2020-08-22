function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "" && key != "removed_files" && key != "old_file_id") {
      return {
        chef: body,
        error: "Por favor, preecha todos os campos.",
      };
    }
  }
}

function hasAtLeastOneImage(files, body = {
  removed_files: true
}) {
  if (files.length == 0 && body.removed_files) {
    return {
      chef: body,
      error: "Por favor, envie ao menos uma imagem",
    };

  }
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render("admin/chef/create.njk", fillAllFields);
  }

  const sendAtLeastOneImage = hasAtLeastOneImage(req.files)

  if (sendAtLeastOneImage) {
    return res.render("admin/chef/create.njk", {
      ...sendAtLeastOneImage,
      chef: req.body,
    });
  }

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render("admin/chef/edit.njk", fillAllFields);
  }

  const sendAtLeastOneImage = hasAtLeastOneImage(req.files, req.body)

  if (sendAtLeastOneImage) {
    return res.render("admin/chef/edit.njk", sendAtLeastOneImage);
  }

  next();
}

module.exports = {
  post,
  put,
}