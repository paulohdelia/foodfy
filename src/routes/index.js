const express = require("express");

const multer = require("../app/middlewares/multer");

const recipes = require("../app/controllers/main/recipes");
const chefs = require("../app/controllers/main/chefs");

const adminRecipes = require("../app/controllers/admin/recipes");
const adminChefs = require("../app/controllers/admin/chefs");

const users = require("./users");
const profile = require("./profile");
const session = require("./session");

const { isUser } = require("../app/middlewares/session");

const routes = express.Router();

routes.use("/admin/users", users);
routes.use("/admin/profile", profile);
routes.use("/session", session);

/* === MAIN === */

/* RECIPES */
routes.get("/", recipes.index);
routes.get("/about", recipes.about);
routes.get("/recipes", recipes.list);
routes.get("/recipes/:index", recipes.recipe);

/* CHEFS */
routes.get("/chefs", chefs.list);
routes.get("/chefs/:index", chefs.show);

/* === ADMIN ===*/

/* RECIPES */
routes.get("/admin/recipes", isUser, adminRecipes.index);
routes.get("/admin/recipes/create", isUser, adminRecipes.create);
routes.get("/admin/recipes/:id", isUser, adminRecipes.show);
routes.get("/admin/recipes/:id/edit", isUser, adminRecipes.edit);

routes.post(
  "/admin/recipes",
  isUser,
  multer.array("photos", 5),
  adminRecipes.post
);
routes.put(
  "/admin/recipes",
  isUser,
  multer.array("photos", 5),
  adminRecipes.put
);
routes.delete("/admin/recipes", isUser, adminRecipes.delete);

/* CHEFS */
routes.get("/admin/chefs", adminChefs.index);
routes.get("/admin/chefs/create", adminChefs.create);
routes.get("/admin/chefs/:id", adminChefs.show);
routes.get("/admin/chefs/:id/edit", adminChefs.edit);

routes.post("/admin/chefs", multer.array("photos", 1), adminChefs.post);
routes.put("/admin/chefs", multer.array("photos", 1), adminChefs.put);
routes.delete("/admin/chefs", adminChefs.delete);

module.exports = routes;
