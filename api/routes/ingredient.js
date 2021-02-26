const express = require('express');
const router = express.Router();
const authenticate = require('../auth/check-auth');


const Ingredient = require('../models/ingredient');

const IngredientController = require('../controllers/ingredient');

// handle get for all ingredients.
router.get("/", IngredientController.ingredient_get_all)
// handle get for single ingredient by id.
router.get("/:ingredientID", IngredientController.ingredient_get_one);

//router.post('/', authenticate, IngredientController.ingredient_post);
router.post('/', IngredientController.ingredient_post);

router.patch("/:ingredientID", IngredientController.ingredient_patch)

router.delete("/:ingredientID", IngredientController.ingredient_delete)

module.exports = router;