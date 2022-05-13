const recipesRouter = require('express').Router();
const { getRecipes, getRecipeById } = require('../controllers/recipes.controllers')

recipesRouter.route('/').get(getRecipes)
recipesRouter.route('/:id').get(getRecipeById)

module.exports = recipesRouter;