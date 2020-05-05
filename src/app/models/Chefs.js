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

    find(id, callback) {
        const query = `
            SELECT recipes.chef_id, recipes.id AS recipe_id, recipes.title, recipes.image , chefs.*
                FROM chefs
                LEFT JOIN recipes ON recipes.chef_id = chefs.id
            WHERE chefs.id = $1
        `

        db.query(query, [id], function (err, results) {
            if (err) throw `Database Error! ${err}`;
            callback(results.rows)
        });
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
        })
    }
}