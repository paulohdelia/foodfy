const express = require("express");

const RecipeController = require("../../app/controllers/main/RecipeController");

const routes = express.Router();

routes.get("/", RecipeController.list);
routes.get("/:id", RecipeController.recipe);

module.exports = routes;
