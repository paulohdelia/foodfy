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
};
