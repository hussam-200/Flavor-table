require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const pg =require("pg");
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/users/');
});
app.use(express.static('public'));
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });


const recipesRouter = require('./routes/recipes');
app.use("/api/recipes",recipesRouter);
const homeRouter = require('./routes/home');
app.use("/users",homeRouter);
const login=require("./routes/users");
app.use("/api",login);



const PORT = process.env.PORT || 3000;
pool.connect()
.then(()=>{
app.listen(PORT, () => {
    console.log(`this is port web used ${PORT}`);
})})
.catch((error)=>{
console.log(error);
});