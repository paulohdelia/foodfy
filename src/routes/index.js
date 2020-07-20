const express = require("express");

const session = require("./session");
const admin = require("./admin");
const public = require("./public");

const { isUser } = require("../app/middlewares/session");

const routes = express.Router();

routes.use("/", public);
routes.use("/session", session);
routes.use("/admin", isUser, admin);

module.exports = routes;
