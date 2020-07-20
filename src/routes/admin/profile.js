const express = require("express");
const routes = express.Router();

const ProfileController = require("../../app/controllers/admin/ProfileController");
const UserValidator = require("../../app/validators/users");

routes.get("/", UserValidator.show, ProfileController.index);
routes.put("/", UserValidator.update, ProfileController.put);

module.exports = routes;
