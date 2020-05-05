const Admin = require('../models/Admin-chefs')

exports.index = function (req, res) { // Mostrar a lista de receitas
    Admin.all(function (chefs) {
        return res.render("admin/chef/list", { chefs });
    })
}

exports.create = function (req, res) { // Mostrar formulário de nova receita
    return res.render("admin/chef/create")
}


exports.show = function (req, res) { // Exibir detalhes de uma receita
    const id = req.params.id;

    Admin.find(id, function (chef) {
        return res.render("admin/chef/detail", { chef: chef[0], recipes: chef })
    });
}

exports.edit = function (req, res) { // Mostrar formulários de edição de receita
    Admin.find(req.params.id, function (chef) {
        return res.render("admin/chef/edit", { chef: chef[0] })
    })
}

exports.post = function (req, res) { // Cadastrar nova receita
    Admin.create(req.body, function (chef) {
        return res.redirect(`/admin/chefs/${chef.id}`)
    })
}

exports.put = function (req, res) { // Editar uma receita  
    Admin.update(req.body, function (id) {
        return res.redirect(`/admin/chefs/${id}`);
    })
}

exports.delete = function (req, res) { // Deletar uma receita
    Admin.delete(req.body.id, function () {
        return res.redirect(`/admin/chefs`)
    })
}