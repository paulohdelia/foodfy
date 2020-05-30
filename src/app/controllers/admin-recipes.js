const File = require('../models/File');
const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    async index(req, res) {
        let results = await Recipe.all({});
        let recipes = results.rows;

        recipes = recipes.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
        }));
        return res.render("admin/recipe/list", { recipes });
    },
    async create(req, res) { // Mostrar formulário de nova receita
        const results = await Chef.getNames();
        const chefs = results.rows;

        return res.render("admin/recipe/create", { chefs });
    },
    async show(req, res) { // Exibir detalhes de uma receita
        const results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];

        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }));

        return res.render("admin/recipe/detail", { recipe, files })
    },
    async edit(req, res) { // Mostrar formulários de edição de receita
        let results = await Chef.getNames();
        const chefs = results.rows;

        results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];

        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }));

        return res.render("admin/recipe/edit", { recipe, chefs, files });
    },
    async post(req, res) { // Cadastrar nova receita    
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Please, fill all fields!');
            }
        }

        if (req.files.length == 0) {
            return res.send('Please, send at least one image')
        }

        let results = await Recipe.create(req.body);
        const recipeId = results.rows[0].id;

        const filePromise = req.files.map(file => File.create({ ...file }));
        results = await Promise.all(filePromise);

        const recipeFilePromise = results.map(result => Recipe.createOnRecipeFiles({ recipe_id: recipeId, file_id: result.rows[0].id }));
        await Promise.all(recipeFilePromise);

        return res.redirect(`/admin/recipes/${recipeId}`);
    },
    async put(req, res) { // Editar uma receita  
        if (req.files.length > 0) {
            const newFilesPromise = req.files.map(file => File.create({ ...file }));
            let results = await Promise.all(newFilesPromise)

            const recipeFilePromise = results.map(result => Recipe.createOnRecipeFiles({ recipe_id: req.body.id, file_id: result.rows[0].id }));
            await Promise.all(recipeFilePromise);
        }
        
        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',');
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);
    
            const removedFilesPromise = removedFiles.map(id => File.delete(id));
            await Promise.all(removedFilesPromise);
        }

        await Recipe.update(req.body);

        return res.redirect(`/admin/recipes/${req.body.id}`);

    },
    delete(req, res) { // Deletar uma receita
        Recipe.delete(req.body.id)

        return res.redirect(`/admin/recipes`)
    },
}