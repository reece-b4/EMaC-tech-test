const recipesRouter = require('express').Router();
const { getRecipes } = require('../controllers/recipes.controllers')

recipesRouter.route('/').get(getRecipes);

module.exports = recipesRouter;