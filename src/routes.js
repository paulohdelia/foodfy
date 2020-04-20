const express = require('express');
const router = express.Router();
const recipes = require('./app/controllers/recipes')
const admin = require('./app/controllers/admin-recipes')

/* === RECIPES === */
router.get("/", recipes.index);
router.get("/about", recipes.about);
router.get("/recipes", recipes.list);
router.get("/recipes/:index", recipes.recipe);

/* === ADMIN ===*/
router.get("/admin/recipes", admin.index)
router.get("/admin/recipes/create", admin.create)
router.get("/admin/recipes/:id", admin.show)
router.get("/admin/recipes/:id/edit", admin.edit)

router.post("/admin/recipes", admin.post)
router.put("/admin/recipes", admin.put)
router.delete("/admin/recipes", admin.delete)

module.exports = router;