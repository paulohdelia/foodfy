const data = require('../data.json');

exports.index = function (req, res) { // Mostrar a lista de receitas
    return res.render("admin/list", { items: data.recipes, link_style: "recipes" })
}

exports.create = function (req, res) { // Mostrar formulário de nova receita
    return res.render("home")
}

exports.show = function (req, res) { // Exibir detalhes de uma receita
    return res.render("home")
}

exports.edit = function (req, res) { // Mostrar formulários de edição de receita
    return res.render("home")
}

exports.post = function (req, res) { // Cadastrar nova receita
    return res.render("home")
}

exports.put = function (req, res) { // Editar uma receita
    return res.render("home")
}

exports.delete = function (req, res) { // Deletar uma receita
    return res.render("home")
}