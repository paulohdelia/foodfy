const Recipe = require('../models/Recipe');
const RecipeFiles = require('../models/Recipe-Files');

exports.index = async function (req, res) {
    const results = await RecipeFiles.all({ limit: 6, reverse: true });

    let recipes = results.rows;
    recipes = recipes.map(recipe => ({
        ...recipe,
        src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
    }));

    return res.render("main/home", {
        recipes,
        banner: {
            image: "https://github.com/Rocketseat/bootcamp-launchbase-desafios-02/blob/master/layouts/assets/chef.png?raw=true",
            image_alt: "Desenho de um chef de cozinha"
        },
    });

}

exports.about = function (req, res) {
    return res.render("main/about", { link_style: "about" });
}

exports.list = async function (req, res) {
    if (req.query.filterRecipes) {
        const filter = req.query.filterRecipes;
        const results = await RecipeFiles.all({ filter })
        let recipes = results.rows;
        recipes = recipes.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
        }));

        return res.render("main/recipes", { recipes, link_style: "recipes", filter });
    } else {
        const results = await RecipeFiles.all({ reverse: true });

        let recipes = results.rows;
        recipes = recipes.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
        }));

        return res.render("main/recipes", { recipes, link_style: "recipes" });

    }
}

exports.recipe = async function (req, res) {
    const results = await RecipeFiles.findByRecipe(req.params.index);

    let files = results.rows;
    files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
    }));

    recipe = {
        ...results.rows[0]
    }

    return res.render("main/recipe", { recipe, files, link_style: "recipes" })
}