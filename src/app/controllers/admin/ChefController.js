const Chef = require("../../models/Chef");
const File = require("../../models/File");
const LoadServiceChefs = require("../../services/LoadChefs");
const DeleteFilesService = require("../../services/DeleteFiles");

module.exports = {
  async index(req, res) {
    const chefs = await LoadServiceChefs.load("chefs");
    return res.render("admin/chef/list", { chefs });
  },
  create(req, res) {
    return res.render("admin/chef/create");
  },
  async show(req, res) {
    const chef_id = req.params.id;
    const chef = await LoadServiceChefs.load("chef", chef_id);
    const recipes = await LoadServiceChefs.load("recipes", chef_id);

    return res.render("admin/chef/detail", { chef, recipes });
  },
  async edit(req, res) {
    const chef = await LoadServiceChefs.load("chef", req.params.id);
    return res.render("admin/chef/edit", { chef });
  },
  async post(req, res) {
    try {
      const { filename, path } = req.files[0];

      let file_id = await File.create({ name: filename, path });

      await Chef.create({ name: req.body.name, file_id });

      const chefs = await LoadServiceChefs.load("chefs");
      return res.render("admin/chef/list.njk", {
        chefs,
        success: "Novo chef criado com sucesso!",
      });
    } catch {
      return res.render("admin/chef/create.njk", {
        chef: req.body,
        error: "Erro inesperado ao criar um chef. Por favor, tente novamente.",
      });
    }
  },
  async put(req, res) {
    try {
      let file_id = req.body.old_file_id;

      if (req.files[0]) {
        const { filename, path } = req.files[0];

        file_id = await File.create({ name: filename, path });
      }

      await Chef.update(req.body.id, { name: req.body.name, file_id });

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const filesPromise = removedFiles.map((id) => File.find(id));
        await Promise.all(filesPromise).then(
          async (files) =>
            await DeleteFilesService.load("removeFiles", "", files)
        );
      }

      const chefs = await LoadServiceChefs.load("chefs");
      return res.render("admin/chef/list.njk", {
        chefs,
        success: "Chef editado com sucesso!",
      });
    } catch {
      return res.render("admin/chef/edit.njk", {
        chef: req.body,
        error: "Erro inesperado ao editar um chef. Por favor, tente novamente.",
      });
    }
  },
  async delete(req, res) {
    try {
      const id = req.body.id;

      const files = await LoadServiceChefs.load("allFiles", id);

      await Chef.delete(id);

      await DeleteFilesService.load("removeFiles", "", files);

      const chefs = await LoadServiceChefs.load("chefs");
      return res.render("admin/chef/list", {
        chefs,
        success: "Chef removido com sucesso",
      });
    } catch (error) {
      console.error(error);
      return res.render("admin/chef/edit.njk", {
        chef: req.body,
        error:
          "Erro inesperado ao remover um chef. Por favor, tente novamente.",
      });
    }
  },
};
