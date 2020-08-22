const { unlinkSync } = require('fs');

const Chef = require('../../models/Chef');
const File = require('../../models/File');

module.exports = {
    async index(req, res) {
        const results = await Chef.all({})
        let chefs = results.rows;

        chefs = chefs.map(chef => ({
            ...chef,
            src: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
        }));
        return res.render("admin/chef/list", { chefs });
    },
    create(req, res) {
        return res.render("admin/chef/create")
    },
    async show(req, res) {
        let results = await Chef.find(req.params.id);

        let chef = results.rows[0];
        chef.src = `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`;

        results = await Chef.getRecipes(req.params.id);
        let recipes = results.rows;
        recipes = recipes.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`
        }));

        return res.render("admin/chef/detail", { chef, recipes })
    },
    async edit(req, res) {

        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        results = await Chef.getAvatar(req.params.id);
        let image = results.rows[0];
        image.src = `${req.protocol}://${req.headers.host}${image.path.replace('public', '')}`

        return res.render("admin/chef/edit", { chef, image })
    },
    async post(req, res) {
        try {
            const { filename, path } = req.files[0];

            let file_id = await File.create({ name: filename, path });

            const { name } = req.body;

            await Chef.create({ name, file_id })

            let chefs = await Chef.findAll();

            // chefs = chefs.map(chef => ({
            //     ...chef,
            //     src: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
            // }));

            return res.render("admin/chef/list.njk", {
                chefs,
                success: "Novo chef criado com sucesso!",
            });
        } catch {
            return res.render("admin/chef/create.njk", {
                chef: req.body,
                error: "Erro inesperado ao criar um chef. Por favor, tente novamente.",
            });
        }


    },
    async put(req, res) {
        try {
            let file_id = req.body.old_file_id;

            if (req.files[0]) {
                const { filename, path } = req.files[0];

                file_id = await File.create({ name: filename, path });
            }

            await Chef.update(req.body.id, { name: req.body.name, file_id })

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',');
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);

                const removedFilesPromise = removedFiles.map(id => File.delete(id));
                await Promise.all(removedFilesPromise);
            }

            // const results = await Chef.all({})
            // let chefs = results.rows;

            // chefs = chefs.map(chef => ({
            //     ...chef,
            //     src: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
            // }));

            const chefs = Chef.findAll();
            return res.render("admin/chef/list.njk", {
                chefs,
                user: req.body,
                success: "Chef editado com sucesso!",
            });
        } catch {
            return res.render("admin/chef/edit.njk", {
                chef: req.body,
                error: "Erro inesperado ao editar um chef. Por favor, tente novamente.",
            });
        }
    },
    async delete(req, res) {
        try {
            const chef_id = req.body.id;

            const file = await Chef.file(chef_id);

            try {
                unlinkSync(file.path);
            } catch (err) {
                console.error(err);
            }

            await Chef.delete(chef_id);
            await File.delete(file.id)

            const chefs = await Chef.findAll();
            return res.render("admin/chef/list", {
                chefs,
                success: "Chef removido com sucesso",
            });
        } catch (error) {
            console.error(error);
            return res.render("admin/chef/edit.njk", {
                chef: req.body,
                error: "Erro inesperado ao remover um chef. Por favor, tente novamente.",
            });
        }
    }
}