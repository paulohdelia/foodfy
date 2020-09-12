const db = require("../../config/db");
const File = require("../models/File");

const Base = require("./Base");
Base.init({ table: "recipes" });

module.exports = {
  ...Base,
  all({ filter = "", orderBy = "created_at", limit = null }) {
    return db.query(`
        SELECT * FROM (
            SELECT DISTINCT ON (recipe_files.recipe_id)
            recipe_files.recipe_id AS id, recipe_files.file_id,
            recipes.title, recipes.chef_id, recipes.created_at, recipes.updated_at, recipes.user_id,
            files.path, files.name,
            chefs.name as chef
            FROM recipe_files 
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
            LEFT JOIN files ON (files.id = recipe_files.file_id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
          ) results
          ORDER BY ${orderBy} DESC
          LIMIT(${limit})          
        `);
  },
  find(id) {
    const query = `
        SELECT
            recipes.*,
            recipe_files.file_id,
            files.path, files.name,
            chefs.name as chef
            FROM recipe_files 
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
            LEFT JOIN files ON (files.id = recipe_files.file_id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = ${id}
        `;

    return db.query(query);
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
