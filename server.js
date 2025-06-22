require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.static('public'));


const recipesRouter = require('./routes/recipes');
app.use(recipesRouter);
const homeRouter = require('./routes/home');
app.use(homeRouter);



const Port = process.env.PORT || 3000;
app.listen(Port, () => {
    console.log(`this is port web used ${Port}`);
})

