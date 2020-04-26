const db = require('../../config/db');

module.exports = {
    all(callback) {
        db.query('SELECT * FROM recipes ORDER BY id desc', function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows);
        })
    },

    find(id, callback) {
        db.query('SELECT * FROM recipes WHERE id = $1', [id], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0]);
        });
    }
}