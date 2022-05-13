const { json } = require('express');
const {readFile, writeFile} = require('fs/promises');

exports.fetchRecipes = async (query) => {
    const recipes = await readFile('./data/data.json', 'utf8');
    const parsedRecipes = JSON.parse(recipes);

    if (query?.exclude_ingredients) {
        const excludedIngredientsArr = query.exclude_ingredients.split(',')
        excludedIngredientsArr.forEach((ingredient)=>{
            if (ingredient[ingredient.length-1] === 's') {
                const ingredientSRemoved = ingredient.slice(0, -1)
                excludedIngredientsArr.push(ingredientSRemoved)
            }
            if (ingredient[ingredient.length-1] === 'y') {
                const ingredientYToIes = ingredient.replace(/y$/, 'ies')
                excludedIngredientsArr.push(ingredientYToIes)
            }
            if (excludedIngredientsArr.includes('lemonjuice')) {
                excludedIngredientsArr.push('lemon juice')
            }
        })

        const filteredRecipes = parsedRecipes.filter((recipe)=>{
           return !recipe.ingredients.some(({name})=>{
               return excludedIngredientsArr.includes(name)
            })
        })
        return filteredRecipes
    }
    return parsedRecipes
}

exports.fetchRecipeById = async (id) => {
    const recipes = await this.fetchRecipes();
    const recipe = recipes.filter((recipe)=>{
       return recipe.id === id;
    })
    return recipe[0]
}

exports.addRecipe = async (recipe) => {
    const recipes = await this.fetchRecipes();

    const recipeIds = recipes.map((recipe)=>{
        return recipe.id.match(/\d+$/)[0]
    })

    const largestId = Math.max(...recipeIds)

    recipe.id = `recipe-${largestId+1}`

    const recipesAddRecipe = [...recipes, recipe]

    await writeFile('./data/data.json', JSON.stringify(recipesAddRecipe, null, 2))

    return recipe.id
    
}