const express = require('express');

const multer = require('./app/middlewares/multer');

const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

const adminRecipes = require('./app/controllers/admin-recipes')
const adminChefs = require('./app/controllers/admin-chefs')

const router = express.Router();

/* === MAIN === */

/* RECIPES */
router.get("/", recipes.index);
router.get("/about", recipes.about);
router.get("/recipes", recipes.list);
router.get("/recipes/:index", recipes.recipe);

/* CHEFS */
router.get("/chefs", chefs.list);
router.get("/chefs/:index", chefs.show);

/* === ADMIN ===*/

/* RECIPES */
router.get("/admin/recipes", adminRecipes.index)
router.get("/admin/recipes/create", adminRecipes.create)
router.get("/admin/recipes/:id", adminRecipes.show)
router.get("/admin/recipes/:id/edit", adminRecipes.edit)

router.post("/admin/recipes", multer.array('photos', 5), adminRecipes.post)
router.put("/admin/recipes", multer.array('photos', 5), adminRecipes.put)
router.delete("/admin/recipes", adminRecipes.delete)

/* CHEFS */
router.get("/admin/chefs", adminChefs.index)
router.get("/admin/chefs/create", adminChefs.create)
router.get("/admin/chefs/:id", adminChefs.show)
router.get("/admin/chefs/:id/edit", adminChefs.edit)

router.post("/admin/chefs",  multer.array('photos', 1), adminChefs.post)
router.put("/admin/chefs",  multer.array('photos', 1), adminChefs.put)
router.delete("/admin/chefs", adminChefs.delete)

module.exports = router;