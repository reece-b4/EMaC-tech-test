const { fetchRecipes } = require('../models/recipes.models')

exports.getRecipes = (req, res) => {
    const query = req.query;
    fetchRecipes(query).then((recipes)=>{
        res.status(200).send({recipes})
    })
    .catch((err)=>{
        console.log(err)
    })
}