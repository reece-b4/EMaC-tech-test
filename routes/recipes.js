const recipesRouter = require('express').Router();
const { getRecipes, getRecipeById, postRecipe } = require('../controllers/recipes.controllers')

recipesRouter.route('/')
.get(getRecipes)
.post(postRecipe)
recipesRouter.route('/:id').get(getRecipeById)

module.exports = recipesRouter;