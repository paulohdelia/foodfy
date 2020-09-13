const Recipe = require("../models/Recipe");

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
  async recipe() {
    try {
      const recipe = await Recipe.findOne(this.filter);

      return format(recipe);
    } catch (error) {
      console.error(error);
    }
  },
  async recipes() {
    try {
      const recipes = await Recipe.findAll({ filter: this.filter });
      const formattedrecipes = recipes.map(format);

      // use reverse to invert array and put last created first
      return formattedrecipes.reverse();
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = LoadService;
