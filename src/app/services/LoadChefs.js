const Chef = require("../models/Chef");

function format(value) {
  if (!value.path) {
    value.src = "http://placehold.it/720x480";
  } else {
    value.src = value.path.replace("public", "").replace(/\\/g, "/");
  }
  return value;
}

const LoadService = {
  load(service, filter) {
    this.filter = filter;
    return this[service]();
  },
  async chef() {
    try {
      const chef = await Chef.findOne(this.filter);

      return format(chef);
    } catch (error) {
      console.error(error);
    }
  },
  async chefs() {
    try {
      const chefs = await Chef.findAll({ filter: this.filter });
      const formattedChefs = chefs.map(format);

      return formattedChefs;
    } catch (error) {
      console.error(error);
    }
  },
  async recipes() {
    try {
      const recipes = await Chef.recipes(this.filter);
      const formattedRecipes = recipes.map(format);

      return formattedRecipes;
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = LoadService;
