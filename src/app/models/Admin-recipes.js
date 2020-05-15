const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all(callback) {
        const query = `
            SELECT recipes.id, recipes.title , chefs.name as chef, chefs.id as chef_id
            from recipes 
            left join chefs on chefs.id = recipes.chef_id
            ORDER BY recipes.id desc
        `
        db.query(query, function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows)
        })
    },

    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                image,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        const values = [
            data.chef_id,
            data.title,
            data.image,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if (err) throw `Database Error! ${err}`;
            
            callback(results.rows[0])
        })
    },

    find(id, callback) {
        query = `
            SELECT recipes.*, chefs.name as chef, chefs.id as chef_id
                FROM recipes 
                LEFT JOIN chefs ON chefs.id = recipes.chef_id 
                WHERE recipes.id = $1
        `
        db.query(query, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`;
            callback(results.rows[0])
        });
    },

    update(data, callback) {
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                image=($2),
                title=($3),
                ingredients=($4),
                preparation=($5),
                information=($6)
            WHERE id = $7
        `

        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results){
            if (err) throw `Database Error! ${err}`;

            callback(data.id)
        })
    },

    delete(id, callback) {
        db.query('DELETE FROM recipes WHERE id = $1', [id], function(err, results) {
            if (err) throw `Database Error! ${err}`;
            callback()
        });
    },

    listChefs(callback) {
        db.query("SELECT id, name FROM chefs ORDER BY name ASC", function(err, results) {
            if(err) throw `Database Error! ${err}`;
            callback(results.rows);
        })
    }
}