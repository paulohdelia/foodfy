const express = require('express');

const routes = express.Router();

const UserController = require('../../app/controllers/admin/UserController');
const UserValidator = require('../../app/validators/users');

routes.get('/register', UserController.create);
routes.post('/register', UserValidator.post, UserController.post);

routes.get('/', UserController.list);

routes.get('/:id', UserController.edit);
routes.put('/', UserValidator.put, UserController.put);
routes.delete('/', UserController.delete);

module.exports = routes;
