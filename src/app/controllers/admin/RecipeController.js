const File = require("../../models/File");
const Recipe = require("../../models/Recipe");
const Chef = require("../../models/Chef");
const User = require("../../models/User");

const LoadServiceRecipes = require("../../services/LoadRecipes");
const DeleteFilesService = require("../../services/DeleteFiles");

module.exports = {
  async index(req, res) {
    let recipes = await LoadServiceRecipes.load("recipes", "");

    // users can see only their recipes but admins can see all
    if (!req.session.userIsAdmin) {
      recipes = recipes.filter(
        (recipe) => recipe.user_id == req.session.userId
      );
    }
    return res.render("admin/recipe/list", { recipes });
  },
  async create(req, res) {
    const chefs = await Chef.getNames();

    return res.render("admin/recipe/create", { chefs });
  },
  async show(req, res) {
    const recipe = await LoadServiceRecipes.load("recipe", req.params.id);

    if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
      const id = req.session.userId;
      const user = await User.findOne({ where: { id } });
      return res.render("admin/profile/edit.njk", {
        user,
        error: "Acesso negado!",
      });
    }

    return res.render("admin/recipe/detail", { recipe });
  },
  async edit(req, res) {
    const chefs = await Chef.getNames();

    let recipe = await LoadServiceRecipes.load("recipe", req.params.id);
    if (recipe.files[0].src === "http://placehold.it/720x480") {
      recipe.files = [];
    }

    if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
      const id = req.session.userId;
      const user = await User.findOne({ where: { id } });
      return res.render("admin/profile/edit.njk", {
        user,
        error: "Acesso negado!",
      });
    }

    return res.render("admin/recipe/edit", { recipe, chefs });
  },
  async post(req, res) {
    try {
      const user_id = req.session.userId;

      const {
        chef_id,
        title,
        ingredients,
        preparation,
        information,
      } = req.body;

      const recipe_id = await Recipe.create({
        chef_id,
        user_id,
        title,
        ingredients: `{${ingredients}}`,
        preparation: `{${preparation}}`,
        information,
      });

      const filePromise = req.files.map((file) => {
        const { filename, path } = file;
        return File.create({ name: filename, path });
      });
      const files_id = await Promise.all(filePromise);

      const recipeFilePromise = files_id.map((file_id) =>
        Recipe.createOnRecipeFiles({
          recipe_id,
          file_id,
        })
      );
      await Promise.all(recipeFilePromise);

      let recipes = await LoadServiceRecipes.load("recipes", "");

      // users can see only their recipes but admins can see all
      if (!req.session.userIsAdmin) {
        recipes = recipes.filter((recipe) => recipe.user_id == user_id);
      }
      return res.render("admin/recipe/list", {
        recipes,
        success: "Nova receita criada com sucesso",
      });
    } catch {
      return res.render("admin/recipe/create.njk", {
        recipe: req.body,
        error: "Erro inesperado, tente novamente.",
      });
    }
  },
  async put(req, res) {
    // Editar uma receita
    try {
      const id = req.body.id;

      const recipe = await LoadServiceRecipes.load("recipe", id);

      if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
        const id = req.session.userId;
        const user = await User.findOne({ where: { id } });
        return res.render("admin/profile/edit.njk", {
          user,
          error: "Acesso negado!",
        });
      }

      if (req.files.length > 0) {
        const newFilesPromise = req.files.map((file) => {
          const { filename, path } = file;
          return File.create({ name: filename, path });
        });
        const filesIds = await Promise.all(newFilesPromise);
        const recipeFilePromise = filesIds.map((file_id) =>
          Recipe.createOnRecipeFiles({
            recipe_id: req.body.id,
            file_id,
          })
        );
        await Promise.all(recipeFilePromise);
      }

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

      const {
        chef_id,
        title,
        ingredients,
        preparation,
        information,
      } = req.body;

      await Recipe.update(id, {
        chef_id,
        title,
        ingredients: `{${ingredients}}`,
        preparation: `{${preparation}}`,
        information,
      });

      let recipes = await LoadServiceRecipes.load("recipes", "");

      // users can see only their recipes but admins can see all
      if (!req.session.userIsAdmin) {
        recipes = recipes.filter(
          (recipe) => recipe.user_id == req.session.userId
        );
      }
      return res.render("admin/recipe/list", {
        recipes,
        success: "Receita editada com sucesso",
      });
    } catch (error) {
      console.error(error);
      const chefs = await Chef.getNames();
      return res.render("admin/recipe/create.njk", {
        chefs,
        recipe: req.body,
        error: "Erro inesperado, tente novamente.",
      });
    }
  },
  async delete(req, res) {
    try {
      const id = req.body.id;

      const recipe = await LoadServiceRecipes.load("recipe", id);

      if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
        const id = req.session.userId;
        const user = await User.findOne({ where: { id } });
        return res.render("admin/profile/edit.njk", {
          user,
          error: "Acesso negado!",
        });
      }

      await DeleteFilesService.load("recipe", id);
      await Recipe.delete(id);
      let recipes = await LoadServiceRecipes.load("recipes", "");

      // users can see only their recipes but admins can see all
      if (!req.session.userIsAdmin) {
        recipes = recipes.filter(
          (recipe) => recipe.user_id == req.session.userId
        );
      }

      return res.render("admin/recipe/list", {
        recipes,
        success: "Receita removida com sucesso",
      });
    } catch {
      return res.render("admin/recipe/edit.njk", {
        recipe: req.body,
        error:
          "Erro inesperado ao remover a receita. Por favor, tente novamente.",
      });
    }
  },
};
