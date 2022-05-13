const supertest = require('supertest');
const server = require('../server');

const request = supertest(server);

test('/api', async () => {
  const { body } = await request.get('/api').expect(200);
  expect(body.message).toBe('ok');
});

describe('GET', () => {
    describe('/api/recipes', () => {
      test('status 200, should respond with array of all recipes on key of recipes', async () => {
        const { body: {recipes} } = await request.get('/api/recipes').expect(200);
        expect(recipes.length).toBe(100)
        expect(recipes[0]).toEqual({
          "id": "recipe-59",
          "imageUrl": "http://www.images.com/18",
          "instructions": "60 seconds on the highest setting your blender has, or until a smooth paste has formed",
          "ingredients": [
            { "name": "demerara sugar", "grams": 25 },
            { "name": "flax", "grams": 66 },
            { "name": "apple juice", "grams": 44 },
            { "name": "oat milk", "grams": 198 }
          ]
        })
    recipes.forEach((recipe)=>{
      expect(Object.keys(recipe)).toEqual(['id', 'imageUrl', 'instructions', 'ingredients'])
        })
      })
    })
})
