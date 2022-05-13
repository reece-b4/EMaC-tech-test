const supertest = require("supertest");
const server = require("../server");
const { readFile, writeFile } = require("fs/promises");

const request = supertest(server);

// seed before each test
beforeEach(async ()=>{
  const seed = await readFile("./data/backupData.json", "utf8").catch(
    (err) => {
      console.log(err);
    }
  );
  await writeFile("./data/data.json", seed).catch((err) => {
    console.log(err, "err");
  });
})

test("/api", async () => {
  const { body } = await request.get("/api").expect(200);
  expect(body.message).toBe("ok");
});

describe("GET", () => {
  describe("/api/recipes", () => {
    test("status 200, Should respond with array of all recipes on key of recipes", async () => {
      const {
        body: { recipes },
      } = await request.get("/api/recipes").expect(200);
      expect(recipes).not.toEqual([]);
      expect(recipes.length).toBe(100);
      expect(recipes[0]).toEqual({
        id: "recipe-59",
        imageUrl: "http://www.images.com/18",
        instructions:
          "60 seconds on the highest setting your blender has, or until a smooth paste has formed",
        ingredients: [
          { name: "demerara sugar", grams: 25 },
          { name: "flax", grams: 66 },
          { name: "apple juice", grams: 44 },
          { name: "oat milk", grams: 198 },
        ],
      });
      recipes.forEach((recipe) => {
        expect(Object.keys(recipe)).toEqual([
          "id",
          "imageUrl",
          "instructions",
          "ingredients",
        ]);
      });
    });
    test('Given query "?exclude_ingredients=<ingredientA, ingredientB, etc>", responds with array of recipes not containing excluded ingredients on key of recipes', async () => {
      const {
        body: { recipes },
      } = await request
        .get("/api/recipes?exclude_ingredients=apples,bananas,honey")
        .expect(200);
      expect(recipes).not.toEqual([]);
      recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          expect([
            "apples",
            "bananas",
            "honeys",
            "apple",
            "banana",
            "honey",
          ]).not.toContain(ingredient.name);
        });
      });
    });
    test('Query caters for singulars and plurals that should end in "y" or "ies"eg, strawberry/strawberries. Responds with array of recipes not containing excluded ingredients on key of recipes', async () => {
      const {
        body: { recipes },
      } = await request
        .get("/api/recipes?exclude_ingredients=strawberry")
        .expect(200);
      expect(recipes).not.toEqual([]);
      recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          expect(["strawberries", "strawberry"]).not.toContain(ingredient.name);
        });
      });
    });
    test('Query caters for ingredients with spaces eg "lemon juice". Responds with array of recipes not containing excluded ingredients on key of recipes', async () => {
      const {
        body: { recipes },
      } = await request
        .get("/api/recipes?exclude_ingredients=lemonjuice")
        .expect(200);
      expect(recipes).not.toEqual([]);
      recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          expect(["lemon juice", "lemon juice"]).not.toContain(ingredient.name);
        });
      });
    });
  });
  describe("/recipes/:id", () => {
    test("status 200. Responds with recipe object on key of recipe", async () => {
      const {
        body: { recipe },
      } = await request.get("/api/recipes/recipe-84").expect(200);
      expect(recipe).not.toEqual({});
      expect(recipe).toEqual({
        id: "recipe-84",
        imageUrl: "http://www.images.com/12",
        instructions: "spin it, twist it, pull it, flick it... bop it!",
        ingredients: [
          { name: "apple juice", grams: 1 },
          { name: "linseed", grams: 79 },
          { name: "kale", grams: 48 },
          { name: "grapes", grams: 10 },
        ],
      });
    });
  });
});

describe("POST", () => {
  describe("/recipes", () => {
    test("status 201, Adds recipe to array of recipes in data.json. Responds with newly generated id", async () => {
      const {
        body: { id },
      } = await request
        .post("/api/recipes")
        .send({
          imageUrl: "http://www.images.com/65",
          instructions: "freestyle",
          ingredients: [
            { name: "banana", grams: 30 },
            { name: "flax", grams: 15 },
            { name: "lemon juice", grams: 25 },
            { name: "oat milk", grams: 100 },
          ],
        })
        .expect(201);
      expect(id).not.toEqual(undefined);
      expect(id).toEqual("recipe-100");

      // check recipe has been added
      const {
        body: { recipe },
      } = await request.get("/api/recipes/recipe-100").expect(200);
      expect(recipe).not.toEqual({});
      expect(recipe).toEqual({
        id: "recipe-100",
        imageUrl: "http://www.images.com/65",
        instructions: "freestyle",
        ingredients: [
          { name: "banana", grams: 30 },
          { name: "flax", grams: 15 },
          { name: "lemon juice", grams: 25 },
          { name: "oat milk", grams: 100 },
        ],
      });
    });
    test("status 201, Adds recipe to array of recipes in data.json. Responds with newly generated id", async () => {
      const {
        body: { id },
      } = await request
        .post("/api/recipes")
        .send({
          "imageUrl": "http://www.images.com/5",
          "instructions": "serve deconstructed on a wooden board",
          "ingredients": [
            {
              "name": "milk",
              "grams": 187
            },
            {
              "name": "cocoa nibs",
              "grams": 88
            },
            {
              "name": "lemon juice",
              "grams": 177
            }
          ]
        })
        .expect(201);
      expect(id).not.toEqual(undefined);
      expect(id).toEqual("recipe-87")

      // check for duplication
      const {
        body: { recipes },
      } = await request.get("/api/recipes").expect(200);
      expect(recipes).not.toEqual([]);
      expect(recipes.length).toBe(100);
    });
  });
});

// with more time:
// formatted returned data in get requests to combine weights in duplicate ingredients
// add error testing and error handling middleware, eg tests for incorrect id input, non existent id, missing, incorrect, extra properties/info on sent body.