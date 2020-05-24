const Admin = require('../models/Admin-chefs')
const Chef = require('../models/Chef')

exports.index = async function (req, res) { // Mostrar a lista de receitas
    const results = await Chef.all()
    chefs = results.rows;
    return res.render("admin/chef/list", { chefs });
}

exports.create = function (req, res) { // Mostrar formulário de nova receita
    return res.render("admin/chef/create")
}


exports.show = async function (req, res) { // Exibir detalhes de uma receita
    let results = await Chef.find(req.params.id);

    let recipes = [];
    let total_recipes = 0;

    if (results.rows[0].path) {
        recipes = results.rows;
        recipes = recipes.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
        }));

        total_recipes = results.rows.length;
    }

    let chef = {
        id: results.rows[0].chef_id,
        name: results.rows[0].chef,
        image: results.rows[0].avatar_url
    }

    return res.render("admin/chef/detail", { chef, recipes, total_recipes })
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