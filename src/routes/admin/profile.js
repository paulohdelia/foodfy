const express = require("express");
const routes = express.Router();

const ProfileController = require("../../app/controllers/admin/ProfileController");
const ProfileValidator = require("../../app/validators/profile");

routes.get("/", ProfileValidator.show, ProfileController.index);
routes.put("/", ProfileValidator.update, ProfileController.put);

module.exports = routes;
