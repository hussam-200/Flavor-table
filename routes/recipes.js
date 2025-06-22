require('dotenv').config();
const express = require('express');
const axios = require('axios');
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




module.exports = router;
