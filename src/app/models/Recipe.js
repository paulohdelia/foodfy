const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all(limit) {
        let query = `
            SELECT recipes.*, chefs.name as chef, chefs.id as chef_id
            FROM recipes 
            LEFT JOIN chefs ON chefs.id = recipes.chef_id
            ORDER BY id DESC
        `

        if (limit) {
            query += `LIMIT(${limit})`
        }
        return db.query(query)
    },
    find(id, callback) {
        const query = `
            SELECT recipes.*, chefs.name as chef, chefs.id as chef_id
            FROM recipes 
            LEFT JOIN chefs ON chefs.id = recipes.chef_id 
            WHERE recipes.id = $1
        `
        db.query(query, [id], function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0]);
        });
    },
    findBy(filter, callback) {
        const query = `
        SELECT recipes.*, chefs.name as chef, chefs.id as chef_id
        FROM recipes 
        LEFT JOIN chefs ON chefs.id = recipes.chef_id
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY id DESC
        `
        db.query(query, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows, filter);
        })
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
    update(data) {
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
            WHERE id = $6
        `

        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values);
    }
}