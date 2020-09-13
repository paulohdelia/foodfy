const db = require("../../config/db");
const File = require("../models/File");

const Base = require("./Base");
Base.init({ table: "recipes" });

module.exports = {
  ...Base,
  async findAll(filter) {
    const query = `
      SELECT * FROM (
        SELECT DISTINCT ON (recipes.id) 
        recipes.id, recipes.title, recipes.created_at, recipes.user_id,
        files.path,
        chefs.id as chef_id, chefs.name as chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        ) results
      WHERE title ILIKE '%${filter}%'
    `;
    const results = await db.query(query);

    return results.rows;
  },
  async find(id) {
    const query = `
      SELECT
      recipes.*,
      chefs.name as chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `;

    const results = await db.query(query, [id]);
    return results.rows[0];
  },
  async files(id) {
    const query = `
      SELECT files.*
      FROM recipe_files 
      LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
      LEFT JOIN files ON (files.id = recipe_files.file_id)
      WHERE recipes.id = $1
    `;

    const results = await db.query(query, [id]);
    return results.rows;
  },
  createOnRecipeFiles({ recipe_id, file_id }) {
    const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `;

    const values = [recipe_id, file_id];

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
        `;

    const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];

    return db.query(query, values);
  },
  async delete(id) {
    let results = await db.query(
      "SELECT * FROM recipe_files WHERE recipe_id = $1",
      [id]
    );
    results.rows.map(async (row) => {
      await db.query("DELETE FROM recipe_files WHERE id = $1", [row.id]);
      await File.delete(row.file_id);
      try {
        await db.query("DELETE FROM recipes WHERE id = $1", [row.recipe_id]);
      } catch {}
    });

    return;
  },
};
