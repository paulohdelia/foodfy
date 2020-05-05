const db = require('../../config/db');
const { date } = require('../../lib/utils');

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

    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows[0])
        })
    },

    // find(id,callback){
    //     db.query('SELECT * from chefs WHERE id = $1', [id], function(err, results){
    //         if (err) throw `Database Error! ${err}`;
    //         callback(results.rows[0])
    //     })
    // },

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

    update(data, callback) {
        const query = `
            UPDATE chefs SET
                name=($1),
                avatar_url=($2)
            WHERE id = $3
        `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(data.id)
        })
    },

    delete(id, callback) {
        db.query('DELETE FROM chefs WHERE id = $1', [id], function (err, results) {
            if (err) throw `Database Error! ${err}`;
            callback()
        });
    }
}