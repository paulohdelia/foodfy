const File = require("../../models/File");
const Recipe = require("../../models/Recipe");
const Chef = require("../../models/Chef");
const User = require("../../models/User");

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
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send("Please, fill all fields!");
      }
    }

    if (req.files.length == 0) {
      return res.send("Please, send at least one image");
    }

    const userId = req.session.userId;
    let results = await Recipe.create(req.body, { userId });
    const recipeId = results.rows[0].id;

    const filePromise = req.files.map((file) => File.create({ ...file }));
    results = await Promise.all(filePromise);

    const recipeFilePromise = results.map((result) =>
      Recipe.createOnRecipeFiles({
        recipe_id: recipeId,
        file_id: result.rows[0].id,
      })
    );
    await Promise.all(recipeFilePromise);

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async put(req, res) {
    // Editar uma receita
    const id = req.body.id;

    const results = await Recipe.find(id);
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
      const newFilesPromise = req.files.map((file) => File.create({ ...file }));
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

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    // Deletar uma receita
    const id = req.body.id;

    const results = await Recipe.find(id);
    const recipe = results.rows[0];

    if (recipe.user_id != req.session.userId && !req.session.userIsAdmin) {
      const id = req.session.userId;
      const user = await User.findOne({ where: { id } });
      return res.render("admin/profile/edit.njk", {
        user,
        error: "Acesso negado!",
      });
    }
    Recipe.delete(id);

    return res.redirect(`/admin/recipes`);
  },
};
