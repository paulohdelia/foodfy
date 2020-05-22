const Chefs = require('../models/Chefs');

module.exports = {
    list(req, res) {
        if (req.query.filterChefs) {
            Chefs.findBy(req.query.filterChefs, function(chefs, filter) {
                return res.render("main/chefs", { chefs, link_style: "chefs", filter });
            })
        } else {
            Chefs.all(function (chefs) {
                return res.render("main/chefs", { chefs, link_style: "chefs" });
            });
        }

    },
    show(req, res) {
        const id = req.params.index;
        Chefs.find(id, function (chef) {
            return res.render("main/chef", { chef: chef[0], recipes: chef, link_style: "chefs" })
        });
    }
}