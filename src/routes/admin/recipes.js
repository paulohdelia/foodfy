const express = require("express");
const multer = require("../../app/middlewares/multer");

const RecipeController = require("../../app/controllers/admin/RecipeController");
const RecipeValidator = require("../../app/validators/recipes");
const { isUser } = require("../../app/middlewares/session");

const routes = express.Router();

routes.get("/", isUser, RecipeController.index);
routes.get("/create", isUser, RecipeController.create);
routes.get("/:id", isUser, RecipeController.show);
routes.get("/:id/edit", isUser, RecipeController.edit);

routes.post(
  "/",
  isUser,
  multer.array("photos", 5),
  RecipeValidator.post,
  RecipeController.post
);
routes.put(
  "/",
  isUser,
  multer.array("photos", 5),
  RecipeValidator.put,
  RecipeController.put
);
routes.delete("/", isUser, RecipeController.delete);

module.exports = routes;
