const express = require("express");

const ChefController = require("../../app/controllers/main/ChefController");

const routes = express.Router();

routes.get("/", ChefController.list);
routes.get("/:id", ChefController.show);

module.exports = routes;
