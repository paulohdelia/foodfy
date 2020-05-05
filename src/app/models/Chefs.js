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
    }
}