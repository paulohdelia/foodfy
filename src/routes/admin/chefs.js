const express = require("express");
const multer = require("../../app/middlewares/multer");

const ChefController = require("../../app/controllers/admin/ChefController");
const { isAdmin } = require("../../app/middlewares/permission");

const routes = express.Router();

routes.get("/", ChefController.index);
routes.get("/create", isAdmin, ChefController.create);
routes.get("/:id", ChefController.show);
routes.get("/:id/edit", isAdmin, ChefController.edit);

routes.post("/", isAdmin, multer.array("photos", 1), ChefController.post);
routes.put("/", isAdmin, multer.array("photos", 1), ChefController.put);
routes.delete("/", isAdmin, ChefController.delete);

module.exports = routes;