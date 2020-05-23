const db = require('../../config/db');

module.exports = {
    all(callback) {
        const query = `
            SELECT count(recipes.chef_id) as total_recipes, chefs.id , chefs.name, chefs.avatar_url
                FROM chefs
                LEFT JOIN recipes ON recipes.chef_id = chefs.id
                GROUP BY chefs.name, chefs.avatar_url, chefs.id 
        `

        db.query(query, function (err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows)
        })
    },

    find(id) {
        const query = `
            SELECT DISTINCT ON (recipes.title) 
                chefs.id as chef_id, chefs.name as chef, chefs.avatar_url,
                recipes.title, recipes.id,
                files.path  
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
                LEFT JOIN files ON (files.id = recipe_files.file_id) 
                WHERE chefs.id = $1
        `
        return db.query(query, [id]);
    },
    findBy(filter, callback) {
        const query = `
            SELECT count(recipes.chef_id) as total_recipes, chefs.id , chefs.name, chefs.avatar_url
            FROM chefs
            LEFT JOIN recipes ON recipes.chef_id = chefs.id
            WHERE chefs.name ILIKE '%${filter}%'
            GROUP BY chefs.name, chefs.avatar_url, chefs.id 
        `

        db.query(query, function(err, results) {
            if (err) throw `Database Error!`;
            callback(results.rows, filter)
        });
    }
}