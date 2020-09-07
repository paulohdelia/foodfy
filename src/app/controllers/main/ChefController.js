const LoadServiceChefs = require("../../services/LoadChefs");

module.exports = {
  async list(req, res) {
    let filter = "";
    if (req.query.filterChefs) {
      filter = req.query.filterChefs;
    }

    const chefs = await LoadServiceChefs.load("chefs", filter);

    let info = {
      chefs,
      link_style: "chefs",
    };

    if (filter) {
      info.filter = filter;
    }

    return res.render("main/chef/list", info);
  },
  async show(req, res) {
    const chef_id = req.params.id;
    const chef = await LoadServiceChefs.load("chef", chef_id);
    const recipes = await LoadServiceChefs.load("recipes", chef_id);

    return res.render("main/chef/detail", {
      chef,
      recipes,
      link_style: "chefs",
    });
  },
};
