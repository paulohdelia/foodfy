const Chef = require('../models/Chef');

module.exports = {
    list(req, res) {
        if (req.query.filterChefs) {
            Chef.findBy(req.query.filterChefs, function (chefs, filter) {
                return res.render("main/chefs", { chefs, link_style: "chefs", filter });
            })
        } else {
            Chef.all(function (chefs) {
                return res.render("main/chefs", { chefs, link_style: "chefs" });
            });
        }

    },
    async show(req, res) {
        const id = req.params.index;
        
        let results = await Chef.find(id);
        
        let recipes = [];

        if (results.rows[0].path) {
            recipes = results.rows;
            recipes = recipes.map(recipe => ({
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
            }));
        }

        let chef = {
                id: results.rows[0].id,
                name: results.rows[0].chef,
                image: results.rows[0].avatar_url
        }

        return res.render("main/chef", { chef, recipes, link_style: "chefs" })
    }
}