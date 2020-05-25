const Admin = require('../models/Admin-chefs');
const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe')
const File = require('../models/File');

module.exports = {
    async index(req, res) { // Mostrar a lista de receitas
        const results = await Chef.all()
        chefs = results.rows;
        return res.render("admin/chef/list", { chefs });
    },
    async create(req, res) { // Mostrar formulário de nova receita
        return res.render("admin/chef/create")
    },
    async show(req, res) { // Exibir detalhes de uma receita
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
    },
    async edit(req, res) { // Mostrar formulários de edição de receita

        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        results = await Chef.getAvatar(req.params.id);
        let image = results.rows[0];
        image.src = `${req.protocol}://${req.headers.host}${image.path.replace('public', '')}`

        return res.render("admin/chef/edit", { chef, image })
    },
    async post(req, res) { // Cadastrar nova receita
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "old_file_id") {
                return res.send('Please, fill all fields!');
            }
        }

        if (req.files.length == 0 && key != "removed_files") {
            return res.send('Please, send at least one image')
        }

        const { filename, path } = req.files[0];

        let results = await File.create({ filename, path });
        const file_id = results.rows[0].id;

        const { name } = req.body;

        results = await Chef.create({ name, file_id })
        const chef_id = results.rows[0].id;

        return res.redirect(`/admin/chefs/${chef_id}`)
    },
    async put(req, res) { // Editar uma receita  
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Please, fill all fields!');
            }
        }

        if (req.files.length == 0 && req.body.removed_files) {
            return res.send('Please, send at least one image')
        }

        let file_id = req.body.old_file_id;
 
        if (req.files[0]) {
            const { filename, path } = req.files[0];
    
            let results = await File.create({ filename, path });
            file_id = results.rows[0].id;
        }

        await Chef.update({name: req.body.name, file_id, id: req.body.id})

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',');
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromise = removedFiles.map(id => File.delete(id));
            await Promise.all(removedFilesPromise);
        }


        return res.redirect(`/admin/chefs/${req.body.id}`);
    },
    async delete(req, res) { // Deletar uma receita
        await Chef.delete(req.body.id)
        
        return res.redirect(`/admin/chefs`)
        
    }
}