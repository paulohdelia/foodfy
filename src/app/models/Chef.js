const db = require('../../config/db');
const { date } = require('../../lib/utils')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

module.exports = {
    all() {
        const query = `
            SELECT *
                FROM chefs
                LEFT JOIN recipes ON recipes.chef_id = chefs.id
        `
        return db.query(query);
    },
    create({ name, file_id }) { //#
        const query = `
            INSERT INTO chefs (
                name,
                file_id,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            name,
            file_id,
            date(Date.now()).iso
        ]

        return db.query(query, values);
    },
    update({ name, file_id, id }) {
        const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3
        `

        const values = [
            name,
            file_id,
            id
        ]

        return db.query(query, values);
    },
    find(id) {
        return db.query('SELECT * FROM chefs WHERE id = $1', [id]);
    },
    getAvatar(id) {
        return db.query('SELECT * FROM chefs LEFT JOIN files ON (chefs.file_id = files.id) WHERE chefs.id = $1', [id])
    },
    async delete(id) {
        let results = await db.query('DELETE FROM chefs WHERE id = $1 RETURNING file_id', [id]);
        const file_id = results.rows[0].file_id;

        await File.delete(file_id);

        results = await db.query('SELECT id FROM recipes WHERE chef_id = $1', [id])
        const recipes = results.rows;

        const removedRecipes = recipes.map(recipe => Recipe.delete(recipe.id))
        await Promise.all(removedRecipes);
        
        return
    }
}