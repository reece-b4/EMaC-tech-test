const { fetchRecipes, fetchRecipeById } = require('../models/recipes.models')

exports.getRecipes = (req, res) => {
    const {query} = req;
    fetchRecipes(query).then((recipes)=>{
        res.status(200).send({recipes})
    })
    .catch((err)=>{
        console.log(err)
    })
}

exports.getRecipeById = (req, res) => {
    const {params: {id}} = req;
    fetchRecipeById(id).then((recipe)=>{
        res.status(200).send({recipe})
    })
    .catch((err)=>{
        console.log(err)
    })
}