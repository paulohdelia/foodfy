const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "users" });

module.exports = {
  ...Base,
  async files(id) {
    const query = `
    SELECT
      recipes.created_at,
      files.path, files.id
      FROM recipes
      LEFT JOIN users ON (recipes.user_id = users.id)
      LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      WHERE users.id = $1
    ORDER BY created_at DESC  `;

    const results = await db.query(query, [id]);
    return results.rows;
  },
};
