const express = require("express");

const ChefController = require("../../app/controllers/main/chefs");

const routes = express.Router();

routes.get("/", ChefController.list);
routes.get("/:index", ChefController.show);

module.exports = routes;
