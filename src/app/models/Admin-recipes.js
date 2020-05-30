const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all() {
        const query = `
            SELECT recipes.id, recipes.title , chefs.name as chef, chefs.id as chef_id
            FROM recipes 
            LEFT JOIN chefs ON chefs.id = recipes.chef_id
            ORDER BY recipes.id DESC
        `
        return db.query(query);
    },

    create(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query, values);
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

        return db.query(query, values, function(err, results){
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

    
}