const data = require('../data.json');

exports.index = function (req, res) { // Mostrar a lista de receitas
    return res.render("admin/list", { items: data.recipes, link_style: "recipes" })
}

exports.create = function (req, res) { // Mostrar formulário de nova receita
    return res.render("admin/create")
}

exports.show = function (req, res) { // Exibir detalhes de uma receita
    const recipeIndex = req.params.id;
    return res.render("admin/detail", { items: data.recipes[recipeIndex], recipeIndex, link_style: "recipes" })
}

exports.edit = function (req, res) { // Mostrar formulários de edição de receita
    return res.render("admin/edit")
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