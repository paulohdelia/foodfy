const data = require('../../../data.json');
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
    const recipe = {
        ...req.body
    }

    data.recipes.push(recipe);

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send('Write error!')

        return res.redirect(`/admin/recipes/${data.recipes.length-1}`)
    })
}

exports.put = function (req, res) { // Editar uma receita
        
    const recipe = {
        ...req.body
    }

    delete recipe.id

    data.recipes[req.body.id] = recipe;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send('Write error!')

        return res.redirect(`/admin/recipes/${req.body.id}`)
    })
}

exports.delete = function (req, res) { // Deletar uma receita
    
    if (data.recipes.length == 1) {
         data.recipes = []
    } else {
        data.recipes.splice(req.body.id, 1)
    }
    

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send('Write error!')

        return res.redirect(`/admin/recipes`)
    })
}