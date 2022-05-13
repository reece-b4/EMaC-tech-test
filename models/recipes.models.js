const {readFile} = require('fs/promises');

exports.fetchRecipes = async () => {
    // console.log('model')
    const recipes = await readFile('./data/data.json', 'utf8');
    return JSON.parse(recipes)

}