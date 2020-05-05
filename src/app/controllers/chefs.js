const Chefs = require('../models/Chefs');

module.exports = {
    list(req, res) {
        Chefs.all(function(chefs) {
            return res.render("main/chefs", {  chefs, link_style: "chefs" })
        });
    },
    detail(req, res) {

    }
}