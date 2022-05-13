const {readFile} = require('fs/promises');

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
                const ingredientYToIes = ingredient.replace(/(y$)/, 'ies')
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