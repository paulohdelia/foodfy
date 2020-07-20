const express = require("express");

const routes = express.Router();

const UserController = require("../../app/controllers/admin/UserController");

routes.get("/register", UserController.create);
routes.post("/register", UserController.post);

routes.get("/", UserController.list);

routes.get("/:id", UserController.edit);
routes.put("/", UserController.put);
routes.delete("/", UserController.delete);

module.exports = routes;
