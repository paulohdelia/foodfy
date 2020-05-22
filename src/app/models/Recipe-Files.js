const db = require('../../config/db');

module.exports = {
    all() {
        return db.query(`
            SELECT DISTINCT ON (recipe_files.recipe_id)
            recipe_files.recipe_id AS id, recipe_files.file_id,
            recipes.title, recipes.chef_id,
            files.path, files.name
            FROM recipe_files 
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
            LEFT JOIN files ON (files.id = recipe_files.file_id)
        `)
    },
    create({ recipe_id, file_id }) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `;

        const values = [
            recipe_id,
            file_id
        ];

        return db.query(query, values);
    },
    findByRecipe(recipe_id) {
        const query = `
            SELECT * 
            FROM recipe_files 
            LEFT JOIN files ON (recipe_files.file_id = files.id) 
            WHERE recipe_files.recipe_id = ${recipe_id}
        `;

        return db.query(query);
    }
}