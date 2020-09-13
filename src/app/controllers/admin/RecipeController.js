const File = require("../../models/File");
const Recipe = require("../../models/Recipe");
const Chef = require("../../models/Chef");
const User = require("../../models/User");

const LoadServiceRecipes = require("../../services/LoadRecipes");

module.exports = {
  async index(req, res) {
    let results = await Recipe.all({ orderBy: "created_at" });
    let recipes = results.rows;

    recipes = recipes.map((recipe) => ({
      ...recipe,
      src: `${req.protocol}://${req.headers.host}${recipe.path.replace(
        "public",
        ""
      )}`,
    }));

    // users can see only their recipes but admins can see all
    if (!req.session.userIsAdmin) {
      recipes = recipes.filter(
        (recipe) => recipe.user_id == req.session.userId
      );
    }
    return res.render("admin/recipe/list", { recipes });
  },
  async create(req, res) {
    // Mostrar formulário de nova receita
    const results = await Chef.getNames();
    const chefs = results.rows;

    return res.render("admin/recipe/create", { chefs });
  },
  async show(req, res) {
    // Exibir detalhes de uma receita
    const results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
      const id = req.session.userId;
      const user = await User.findOne({ where: { id } });
      return res.render("admin/profile/edit.njk", {
        user,
        error: "Acesso negado!",
      });
    }

    let files = results.rows;
    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/recipe/detail", { recipe, files });
  },
  async edit(req, res) {
    // Mostrar formulários de edição de receita
    let results = await Chef.getNames();
    const chefs = results.rows;

    results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
      const id = req.session.userId;
      const user = await User.findOne({ where: { id } });
      return res.render("admin/profile/edit.njk", {
        user,
        error: "Acesso negado!",
      });
    }

    let files = results.rows;
    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/recipe/edit", { recipe, chefs, files });
  },
  async post(req, res) {
    // Cadastrar nova receita
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
          const results = await Chef.getNames();
          const chefs = results.rows;

          return res.render("admin/recipe/create.njk", {
            chefs,
            recipe: req.body,
            error: "Por favor, preecha todos os campos",
          });
        }
      }

      if (req.files.length == 0) {
        return res.render("admin/recipe/create.njk", {
          recipe: req.body,
          error: "Por favor, envia ao menos uma imagem",
        });
      }

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
    } catch (error) {
      console.error(error);
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

      let results = await Recipe.find(id);
      const recipe = results.rows[0];

      if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
        const id = req.session.userId;
        const user = await User.findOne({ where: { id } });
        return res.render("admin/profile/edit.njk", {
          user,
          error: "Acesso negado!",
        });
      }

      if (req.files.length > 0) {
        const newFilesPromise = req.files.map((file) =>
          File.create({ ...file })
        );
        let results = await Promise.all(newFilesPromise);

        const recipeFilePromise = results.map((result) =>
          Recipe.createOnRecipeFiles({
            recipe_id: req.body.id,
            file_id: result.rows[0].id,
          })
        );
        await Promise.all(recipeFilePromise);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedFilesPromise = removedFiles.map((id) => File.delete(id));
        await Promise.all(removedFilesPromise);
      }

      await Recipe.update(req.body);

      results = await Recipe.all({ orderBy: "created_at" });
      let recipes = results.rows;

      recipes = recipes.map((recipe) => ({
        ...recipe,
        src: `${req.protocol}://${req.headers.host}${recipe.path.replace(
          "public",
          ""
        )}`,
      }));

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
    } catch {
      return res.render("admin/recipe/create.njk", {
        recipe: req.body,
        error: "Erro inesperado, tente novamente.",
      });
    }
  },
  async delete(req, res) {
    // Deletar uma receita
    try {
      const id = req.body.id;

      let results = await Recipe.find(id);
      const recipe = results.rows[0];

      if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
        const id = req.session.userId;
        const user = await User.findOne({ where: { id } });
        return res.render("admin/profile/edit.njk", {
          user,
          error: "Acesso negado!",
        });
      }
      await Recipe.delete(id);

      results = await Recipe.all({ orderBy: "created_at" });
      let recipes = results.rows;

      recipes = recipes.map((recipe) => ({
        ...recipe,
        src: `${req.protocol}://${req.headers.host}${recipe.path.replace(
          "public",
          ""
        )}`,
      }));

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
    } catch (err) {
      console.error(err);
      return res.render("admin/recipe/edit.njk", {
        recipe: req.body,
        error:
          "Erro inesperado ao remover a receita. Por favor, tente novamente.",
      });
    }
  },
};
