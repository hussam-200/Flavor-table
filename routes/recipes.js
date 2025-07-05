require('dotenv').config();
const express = require('express');
const axios = require('axios');
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const router = express.Router();

router.get("/recipes/random", async (req, res) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/random`
      , {
        params: {
          apiKey: process.env.SPOONACULAR_KEY,
          number: 10,
        }
      }
    );
    res.json(response.data.recipes);
    console.log(response.data.recipes);

  } catch (error) {
    console.log(error);

  }


})
router.get('/recipes/search', async (req, res) => {
  const ingredients = req.query.ingredients;
  if (!ingredients) {
    return res.status(400).json({ error: 'Missing ingredients parameter' });
  }

  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        apiKey: process.env.SPOONACULAR_KEY,
        ingredients,
        number: 5,
      }
    });

    const simplified = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients.map(i => i.name),
      missedIngredients: recipe.missedIngredients.map(i => i.name)
    }));
    res.json(simplified);
    console.log(simplified);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});
router.post("/post", async (req, res) => {
  let { title, image, instructions, ingredients, readin } = req.body;
  console.log("Received body:", req.body);
  console.log("Type of ingredients:", typeof req.body.ingredients);

  try {
    if (readin === "" || readin === null || readin === undefined) {
      readin = null;
    }
    else {
      readin = Number(readin);
    }
    if (typeof ingredients !== "string") {
      ingredients = JSON.stringify(ingredients);
    }
    const result = await pool.query("INSERT INTO public.recipes(title,image,instructions,ingredients,readin) VALUES($1,$2,$3,$4,$5)  RETURNING *",
      [title, image, instructions, ingredients, readin]
    )
    res.json(result.rows[0]);
  } catch (error) {
    console.log("error giting data ", error);
    res.status(500).json({ error: error.message });
  }
})
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.recipes");
    res.json(result.rows);
  } catch (error) {
    console.log("error giting data ", error);
    res.status(500).json({ error: error.message });
  }
})
router.delete("/delete/all", async (req, res) => {
  try {
    const response = await pool.query("DELETE FROM public.recipes");
    res.json(response.rows);
  } catch (error) {
    console.log("Error deleting all recipes:", error);
    res.status(500).json({ error: "Internal server" });
  }
});
router.delete("/delete/:id", async (req, res,) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM public.recipes WHERE id=$1 RETURNING *",
      [id]
    )
    res.json(result.rows[0]);
  } catch (error) {
    console.log("error deleting items", error);
    res.status(500).json({ error: "Internal Server Error" });

  }
})
router.put("/put/:id", async (req, res) => {
  const { id } = req.params;
  let { title, image, instructions, ingredients, readin } = req.body;
  try {
    if (readin === "" || readin === null || readin === undefined) {
      readin = null;
    }
    else {
      readin = Number(readin);
    }
    if (typeof ingredients !== "string") {
      ingredients = JSON.stringify(ingredients);
    }
    const result = await pool.query(
      "UPDATE public.recipes SET title=$1,image=$2,instructions=$3,ingredients=$4,readin=$5 WHERE id=$6 RETURNING *",
      [title, image, instructions, ingredients, readin, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.log("error updating item", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
