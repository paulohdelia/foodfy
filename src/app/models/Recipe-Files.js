const db = require('../../config/db');

module.exports = {
    all({limit = null, filter = '', reverse = false}) {

        const order = reverse ? 'DESC' : 'ASC';

        return db.query(`
            SELECT DISTINCT ON (recipe_files.recipe_id)
            recipe_files.recipe_id AS id, recipe_files.file_id,
            recipes.title, recipes.chef_id,
            files.path, files.name,
            chefs.name as chef
            FROM recipe_files 
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
            LEFT JOIN files ON (files.id = recipe_files.file_id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
            ORDER BY id ${order}
            LIMIT(${limit})
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
        SELECT
            recipes.*,
            recipe_files.file_id,
            files.path, files.name,
            chefs.name as chef
            FROM recipe_files 
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
            LEFT JOIN files ON (files.id = recipe_files.file_id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = ${recipe_id}
        `;

        return db.query(query);
    },
    deleteFile(file_id) {
        db.query(`
            DELETE FROM recipe_files where file_id = ${file_id};
            DELETE FROM files where id = ${file_id};
        `);
    }
}