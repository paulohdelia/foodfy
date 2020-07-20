const express = require("express");

const routes = express.Router();

const RecipeController = require("../../app/controllers/main/recipes");
const chefs = require("./chefs");
const recipes = require("./recipes");

routes.get("/", RecipeController.index);
routes.get("/about", RecipeController.about);

routes.use("/chefs", chefs);
routes.use("/recipes", recipes);

module.exports = routes;
