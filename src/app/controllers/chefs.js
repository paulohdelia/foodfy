const Chef = require('../models/Chef');

module.exports = {
    async list(req, res) {
        let filter = '';
        if(req.query.filterChefs) {
            filter = req.query.filterChefs
        }
        const results = await Chef.all({filter})
        let chefs = results.rows;

        chefs = chefs.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
        }));

        let info = {
            chefs,
            link_style: "chefs",
        }
    
        if(filter) {
            info.filter = filter
        }
        
        return res.render("main/chef/list", info);
    },
    async show(req, res) {
        let results = await Chef.find(req.params.index);

        let chef = results.rows[0];
        chef.src = `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`;

        results = await Chef.getRecipes(req.params.index);
        let recipes = results.rows;
        recipes = recipes.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
        }));

        return res.render("main/chef/detail", { chef, recipes, link_style: "chefs" })
    }
}