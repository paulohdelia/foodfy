const express = require("express");

const RecipeController = require("../../app/controllers/main/recipes");

const routes = express.Router();

routes.get("/", RecipeController.list);
routes.get("/:index", RecipeController.recipe);

module.exports = routes;
