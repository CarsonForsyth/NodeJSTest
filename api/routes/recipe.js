const express = require('express');
const router = express.Router();
const authenticate = require('../auth/check-auth');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname.split(" ").join("_")}`)
    }
});
const upload = multer({storage: storage});

const Recipe = require('../models/recipe');

const RecipeController = require('../controllers/recipe');

// handle get for all recipes.
router.get("/", RecipeController.recipe_get_all)
// handle get for single recipe by id.
router.get("/:recipeID", RecipeController.recipe_get_one);

//router.post('/', authenticate, upload.single('recipeImage'), RecipeController.recipe_post);
router.post('/', upload.single('recipeImage'), RecipeController.recipe_post);

router.patch("/:recipeID", RecipeController.recipe_patch)

router.delete("/:recipeID", RecipeController.recipe_delete)

module.exports = router;