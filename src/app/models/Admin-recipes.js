const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all(callback) {
        db.query('SELECT * FROM recipes ORDER BY id DESC', function(err, results) {
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
            data.chef,
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
        db.query('SELECT * FROM recipes WHERE id = $1', [id], function(err, results) {
            if (err) throw `Database Error! ${err}`;
            callback(results.rows[0])
        });
    },

    update(data, callback) {
        const query = `
            UPDATE recipes SET
                image=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
            WHERE id = $6
        `

        const values = [
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
    }
}