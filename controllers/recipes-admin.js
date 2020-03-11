const data = require('../data.json');
const fs = require('fs')

exports.index = function (req, res) { // Mostrar a lista de receitas
    return res.render("admin/list", { recipes: data.recipes})
}

exports.create = function (req, res) { // Mostrar formulário de nova receita
    return res.render("admin/create")
}

exports.show = function (req, res) { // Exibir detalhes de uma receita
    const recipeIndex = req.params.id;
    return res.render("admin/detail", { recipes: data.recipes[recipeIndex], recipeIndex})
}

exports.edit = function (req, res) { // Mostrar formulários de edição de receita
    const recipeIndex = req.params.id;
    return res.render("admin/edit", { recipes: data.recipes[recipeIndex], recipeIndex})
}

exports.post = function (req, res) { // Cadastrar nova receita
    return res.render("home")
}

exports.put = function (req, res) { // Editar uma receita
    
    const { image, title, author, ingredients, preparation, information } = req.body;
    
    const recipe = {
        image,
        title,
        author,
        ingredients,
        preparation,
        information
    }

    data.recipes[req.body.id] = recipe;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send('Write error!')

        return res.redirect(`/admin/recipes/${req.body.id}`)
    })
     
}

exports.delete = function (req, res) { // Deletar uma receita
    return res.render("home")
}