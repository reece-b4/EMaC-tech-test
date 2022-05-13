const { fetchRecipes } = require('../models/recipes.models')

exports.getRecipes = (req, res) => {
    // console.log('controller')
    fetchRecipes().then((recipes)=>{
        res.status(200).send({recipes})
    })
    .catch((err)=>{
        console.log(err)
    })
}