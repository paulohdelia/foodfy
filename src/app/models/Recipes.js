const db = require('../../config/db');

module.exports = {
    all(callback) {
        const query = `
            SELECT recipes.*, chefs.name as chef, chefs.id as chef_id
            FROM recipes 
            LEFT JOIN chefs ON chefs.id = recipes.chef_id
            ORDER BY id DESC
        `
        db.query(query, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows);
        })
    },

    find(id, callback) {
        const query = `
            SELECT recipes.*, chefs.name as chef, chefs.id as chef_id
            FROM recipes 
            LEFT JOIN chefs ON chefs.id = recipes.chef_id 
            WHERE recipes.id = $1
        `
        db.query(query, [id], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0]);
        });
    }
}