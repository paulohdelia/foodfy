const Recipe = require('../../models/Recipe');

module.exports = {
    async index(req, res) {
        const results = await Recipe.all({ limit: 6 });
    
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
    },
    about(req, res) {
        return res.render("main/about", { link_style: "about" });
    },
    async list(req, res) {
        let filter = '';
        if(req.query.filterRecipes) {
            filter = req.query.filterRecipes
        }
        const allParametes = filter == '' ? {} : { filter, orderBy: 'updated_at' }
        const results = await Recipe.all(allParametes)
        let recipes = results.rows;
        recipes = recipes.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
        }));
    
        let info = {
            recipes,
            link_style: "recipes",
        }
    
        if(filter) {
            info.filter = filter
        }
    
        return res.render("main/recipe/list", info);
    },
    async recipe(req, res) {
        const results = await Recipe.find(req.params.index);
    
        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }));
    
        recipe = {
            ...results.rows[0]
        }
    
        return res.render("main/recipe/detail", { recipe, files, link_style: "recipes" })
    }
}
