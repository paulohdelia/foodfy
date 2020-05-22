const Admin = require('../models/Admin-recipes');
const File = require('../models/File');
const RecipeFiles = require('../models/Recipe-Files');

exports.index = async function (req, res) { // Mostrar a lista de receitas
    let results = await RecipeFiles.all();
    let recipes = results.rows;
    recipes = recipes.map(recipe => ({
        ...recipe,
        src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
    }));
    return res.render("admin/recipe/list", { recipes });
    
}

exports.create = async function (req, res) { // Mostrar formulário de nova receita
    const results = await Admin.listChefs();
    const chefs = results.rows;

    return res.render("admin/recipe/create", { chefs });
}

exports.show = async function (req, res) { // Exibir detalhes de uma receita
    let results = await Admin.find(req.params.id);
    const recipe = results.rows[0];

    results = await RecipeFiles.findByRecipe(req.params.id);
    let files = results.rows;
    files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
    }));

    return res.render("admin/recipe/detail", { recipe, files })
}

exports.edit = async function (req, res) { // Mostrar formulários de edição de receita
    let results = await Admin.find(req.params.id);
    const recipe = results.rows[0]; 
    
    results = await Admin.listChefs();
    const chefs = results.rows;

    results = await RecipeFiles.findByRecipe(req.params.id);
    let files = results.rows;
    files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
    }));

    return res.render("admin/recipe/edit", { recipe, chefs, files });
}

exports.post = async function (req, res) { // Cadastrar nova receita
    if (req.files.length == 0) {
        return res.send('Please, send at least one image')
    }

    let results = await Admin.create(req.body);
    const recipeId = results.rows[0].id;

    const filePromise = req.files.map(file => File.create({ ...file }));
    results = await Promise.all(filePromise);

    const recipeFilePromise = results.map(result => RecipeFiles.create({ recipe_id: recipeId, file_id: result.rows[0].id }));
    await Promise.all(recipeFilePromise);

    return res.redirect(`/admin/recipes/${recipeId}`);
}

exports.put = function (req, res) { // Editar uma receita  
    Admin.update(req.body, function (id) {
        return res.redirect(`/admin/recipes/${id}`);
    })
}

exports.delete = function (req, res) { // Deletar uma receita
    Admin.delete(req.body.id, function () {
        return res.redirect(`/admin/recipes`)
    })
}