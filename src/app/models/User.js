const db = require("../../config/db");

module.exports = {
  create({ name, email, is_adm }) {
    const query = `
            INSERT INTO users (
                name,
                email,
                is_admin
            ) VALUES ($1, $2, $3)
            RETURNING id
        `;

    const values = [name, email, is_adm];

    return db.query(query, values);
  },
  listAll() {
    const query = `
      SELECT * FROM users;
    `;

    return db.query(query);
  },
  findOne({ id }) {
    const query = `
      SELECT * FROM users WHERE id = $1
    `;
    return db.query(query, [id]);
  },
  async findOne(filters) {
    let query = "SELECT * FROM users";

    Object.keys(filters).map((key) => {
      query = `
                ${query}
                ${key}
            `;

      Object.keys(filters[key]).map((field) => {
        query = `
                    ${query}
                    ${field} = '${filters[key][field]}'
                `;
      });
    });

    const results = await db.query(query);

    return results.rows[0];
  },
  update({ name, email, is_adm, id }) {
    const query = `
      UPDATE users SET name = $1, email = $2, is_admin = $3 WHERE id = $4 
    `;

    return db.query(query, [name, email, is_adm, id]);
  },
  delete({ id }) {
    const query = `
      DELETE FROM users WHERE id = $1
    `;

    return db.query(query, [id]);
  },
};
