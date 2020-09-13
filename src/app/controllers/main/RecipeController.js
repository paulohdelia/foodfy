const Recipe = require("../../models/Recipe");
const LoadServiceRecipes = require("../../services/LoadRecipes");

module.exports = {
  async index(req, res) {
    let recipes = await LoadServiceRecipes.load("recipes", "");

    const totalRecipes = 6;

    // show only the first 6 recipes
    recipes = recipes.slice(0, totalRecipes);

    return res.render("main/home", {
      recipes,
      banner: {
        image:
          "https://github.com/Rocketseat/bootcamp-launchbase-desafios-02/blob/master/layouts/assets/chef.png?raw=true",
        image_alt: "Desenho de um chef de cozinha",
      },
    });
  },
  about(req, res) {
    return res.render("main/about", { link_style: "about" });
  },
  async list(req, res) {
    let filter = "";
    if (req.query.filterRecipes) {
      filter = req.query.filterRecipes;
    }

    let recipes = await LoadServiceRecipes.load("recipes", filter);

    let info = {
      recipes,
      link_style: "recipes",
    };

    if (filter) {
      info.filter = filter;
    }

    return res.render("main/recipe/list", info);
  },
  async recipe(req, res) {
    const recipe = await LoadServiceRecipes.load("recipe", req.params.id);

    return res.render("main/recipe/detail", {
      recipe,
      link_style: "recipes",
    });
  },
};
