const data = require('../../data.json');

exports.index = function (req, res) {
    return res.render("main/home", {
        recipes: data.recipes,
        banner: {
            image: "https://github.com/Rocketseat/bootcamp-launchbase-desafios-02/blob/master/layouts/assets/chef.png?raw=true",
            image_alt: "Desenho de um chef de cozinha"
        },
    });
}

exports.about = function(req, res){
    return res.render("main/about", { link_style: "about" });
}

exports.list = function(req, res){
    return res.render("main/recipes", { recipes: data.recipes, link_style: "recipes" });
}   

exports.recipe = function(req, res){
    const recipeIndex = req.params.index;
    return res.render("main/recipe", { recipes: data.recipes[recipeIndex], link_style: "recipes" })
}