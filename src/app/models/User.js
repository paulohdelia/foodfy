const db = require("../../config/db");
const { hash, genSalt } = require("bcryptjs");
const mailer = require("../../lib/mailer");

module.exports = {
  async create({ name, email, is_admin, password }) {
    const query = `
            INSERT INTO users (
                name,
                email,
                is_admin,
                password
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
        `;

    const values = [name, email, is_admin, password];

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
  async update(id, fields) {
    let query = "UPDATE users SET";

    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `
                ${query}
                ${key} = '${fields[key]}',
            `;
      } else {
        query = `
                ${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}
            `;
      }
    });
    await db.query(query);
    return;
  },
  delete({ id }) {
    const query = `
      DELETE FROM users WHERE id = $1
    `;

    return db.query(query, [id]);
  },
};
