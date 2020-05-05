const Recipes = require('../models/Recipes');

exports.index = function (req, res) {
        Recipes.all(function(recipes){
            return res.render("main/home", {
                recipes,
                banner: {
                    image: "https://github.com/Rocketseat/bootcamp-launchbase-desafios-02/blob/master/layouts/assets/chef.png?raw=true",
                    image_alt: "Desenho de um chef de cozinha"
                },
            });
        });
}

exports.about = function(req, res){
    return res.render("main/about", { link_style: "about" });
}

exports.list = function(req, res){
    if (req.query.filterRecipes) {
        Recipes.findBy(req.query.filterRecipes, function(recipes, filter) {
            return res.render("main/recipes", { recipes, link_style: "recipes", filter });
        })
    } else {
        Recipes.all(function(recipes){
            return res.render("main/recipes", { recipes, link_style: "recipes" });
        });
    }
}   

exports.recipe = function(req, res){
    Recipes.find(req.params.index, function(recipes){
        return res.render("main/recipe", { recipes , link_style: "recipes" })
    })
}