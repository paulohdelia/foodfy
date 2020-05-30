const db = require('../../config/db');
const fs = require('fs');

module.exports = {
    create({filename, path}) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `;

        const values = [
            filename,
            path
        ];

        return db.query(query, values);
    },
    async delete(id) {
        try {
            const results = await db.query('SELECT * FROM files WHERE id = $1', [id])
            const file = results.rows[0];

        fs.unlinkSync(file.path)
        } catch(err) {
            console.error(err)
        }

        return db.query(`
            DELETE FROM recipe_files where file_id = ${id};
            DELETE FROM files where id = ${id};
        `);
    }
}