const express = require("express");
const routes = express.Router();

const SessionController = require("../app/controllers/admin/SessionController");

// Login/Logout
routes.get("/login", SessionController.loginForm);
// routes.get("/login", isLoggedRedirectToUsers, SessionController.loginForm);
// routes.post('/login', SessionValidator.login, SessionController.login);
// routes.post('/logout', SessionController.logout);

// Reset Password
routes.get("/forgot-password", SessionController.forgotForm);
// routes.get('/reset-password', SessionController.resetForm);
// routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);
// routes.post('/reset-password', SessionValidator.reset, SessionController.reset);

module.exports = routes;
