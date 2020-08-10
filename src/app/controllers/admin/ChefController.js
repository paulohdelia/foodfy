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
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "" && key != "old_file_id") {
                    return res.render("admin/chef/create.njk", {
                        chef: req.body,
                        error: "Por favor, preecha todos os campos",
                    });
                }
            }

            if (req.files.length == 0 && key != "removed_files") {
                return res.render("admin/chef/create.njk", {
                    chef: req.body,
                    error: "Por favor, envie ao menos uma imagem",
                });
            }

            const { filename, path } = req.files[0];

            let results = await File.create({ filename, path });
            const file_id = results.rows[0].id;

            const { name } = req.body;

            await Chef.create({ name, file_id })

            results = await Chef.all({})
            let chefs = results.rows;

            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
            }));

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
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files" && key != "old_file_id") {
                    return res.render("admin/chef/edit.njk", {
                        chef: req.body,
                        error: "Por favor, preecha todos os campos.",
                    });
                }
            }

            if (req.files.length == 0 && req.body.removed_files) {
                return res.render("admin/chef/edit.njk", {
                    chef: req.body,
                    error: "Por favor, envie ao menos uma imagem",
                });
            }

            let file_id = req.body.old_file_id;

            if (req.files[0]) {
                const { filename, path } = req.files[0];

                let results = await File.create({ filename, path });
                file_id = results.rows[0].id;
            }

            await Chef.update({ name: req.body.name, file_id, id: req.body.id })

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',');
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1);

                const removedFilesPromise = removedFiles.map(id => File.delete(id));
                await Promise.all(removedFilesPromise);
            }

            const results = await Chef.all({})
            let chefs = results.rows;

            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
            }));

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
            await Chef.delete(req.body.id)

            const results = await Chef.all({})
            let chefs = results.rows;

            chefs = chefs.map(chef => ({
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
            }));
            return res.render("admin/chef/list", {
                chefs,
                success: "Chef removido com sucesso",
            });
        } catch {
            return res.render("admin/chef/edit.njk", {
                chef: req.body,
                error: "Erro inesperado ao remover um chef. Por favor, tente novamente.",
            });
        }
    }
}