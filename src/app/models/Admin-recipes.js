const db = require('../../config/db');

module.exports = {
    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `
    }
}