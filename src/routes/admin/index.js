const express = require("express");

const routes = express.Router();
const { isAdmin } = require("../../app/middlewares/permission");

const chefs = require("./chefs");
const recipes = require("./recipes");
const users = require("./users");
const profile = require("./profile");

routes.use("/chefs", chefs);
routes.use("/recipes", recipes);
routes.use("/profile", profile);
routes.use("/users", isAdmin, users);

module.exports = routes;
