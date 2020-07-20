const express = require("express");

const routes = express.Router();

const UserController = require("../../app/controllers/admin/UserController");
const { isAdmin } = require("../../app/middlewares/permission");

routes.get("/register", isAdmin, UserController.create);
routes.post("/register", isAdmin, UserController.post);

routes.get("/", isAdmin, UserController.list);

routes.get("/:id", isAdmin, UserController.edit);
routes.put("/", UserController.put);
routes.delete("/", isAdmin, UserController.delete);

module.exports = routes;
