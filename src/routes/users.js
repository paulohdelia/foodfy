const express = require("express");
const routes = express.Router();

const UserController = require("../app/controllers/admin/UserController");

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get("/register", UserController.create);
routes.post("/register", UserController.post); //Cadastrar um usuário

routes.get("/", UserController.list); //Mostrar a lista de usuários cadastrados

routes.get("/edit", UserController.edit); //Mostrar a lista de usuários cadastrados
routes.put("/edit", UserController.put); // Editar um usuário
routes.delete("/", UserController.delete); // Deletar um usuário

module.exports = routes;
