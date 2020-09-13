const db = require("../../config/db");

const Base = require("./Base");
Base.init({ table: "chefs" });

module.exports = {
  ...Base,
  async findOne(id) {
    const query = `
        SELECT chefs.*, files.path, count.total_recipes
        FROM chefs
        LEFT JOIN files ON files.id = chefs.file_id
        LEFT JOIN ( 
            SELECT COUNT(chefs.id = recipes.chef_id) as total_recipes, chefs.id as chef_id
            FROM chefs LEFT JOIN recipes ON(chefs.id = recipes.chef_id)
                GROUP BY chefs.id
        ) as COUNT ON chefs.id = count.chef_id
        WHERE chef_id = $1
        `;
    const results = await db.query(query, [id]);
    return results.rows[0];
  },
  async findAll({ filter = "" }) {
    const query = `
        SELECT chefs.*, files.path, count.total_recipes
        FROM chefs
        LEFT JOIN files ON files.id = chefs.file_id
        LEFT JOIN ( 
            SELECT COUNT(chefs.id = recipes.chef_id) as total_recipes, chefs.id as chef_id
            FROM chefs LEFT JOIN recipes ON(chefs.id = recipes.chef_id)
                GROUP BY chefs.id
        ) as COUNT ON chefs.id = count.chef_id
        WHERE chefs.name ILIKE '%${filter}%'
        `;
    const results = await db.query(query);
    return results.rows;
  },
  async recipes(id) {
    const results = await db.query(
      `
        SELECT * FROM (
            SELECT DISTINCT ON (recipes.id) 
            recipes.id, recipes.title, recipes.created_at,
            files.path, files.id as file_id
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            WHERE chefs.id = $1 ) results
          ORDER BY created_at DESC       
        `,
      [id]
    );
    return results.rows;
  },
  async getNames() {
    const results = await db.query(
      "SELECT id, name FROM chefs ORDER BY name ASC"
    );
    return results.rows;
  },
  async file(id) {
    let results = await db.query("SELECT file_id FROM chefs WHERE id = $1", [
      id,
    ]);
    const file_id = results.rows[0].file_id;

    results = await db.query("SELECT * FROM files WHERE id = $1", [file_id]);
    return results.rows[0];
  },
};
