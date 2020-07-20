const express = require("express");

const routes = express.Router();

const chefs = require("./chefs");
const recipes = require("./recipes");
const users = require("./users");
const profile = require("./profile");

routes.use("/chefs", chefs);
routes.use("/recipes", recipes);
routes.use("/users", users);
routes.use("/profile", profile);

module.exports = routes;
