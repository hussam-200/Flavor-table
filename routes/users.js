require("dotenv").config();
const express = require("express");
const router = express.Router();
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyingUser = require("../middleWare/auth");

router.get("/user/profile", verifyingUser, async (req, res) => {
    res.status(200).send("injoy in our website")
})
router.post("/auth/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashpassword = await bcrypt.hash(password, 10);
        const result = await pool.query("INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id , username",
            [username, email, hashpassword]
        )

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.log(error);
        if (error.code === '23505') {
            res.status(409).send("Username or Email already exists");
        }
        else {
            res.status(500).send("Server Error");


        }

    }
})
router.post("/auth/login", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE email=$1 AND username=$2 ",
            [email, username]
        )
        const user = result.rows[0];
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send(" Incorrect password")

        }
        const token = await jwt.sign(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }, process.env.JWT_KEY,
            {
                expiresIn: "2h"
            })
        res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error while logging in")


    }
})
router.put("/auth/edit", async (req, res) => {
    console.log("Received body:", req.body);
    const { currentUsername, currentEmail, username, email } = req.body;
    try {
        const result = await pool.query("UPDATE users SET username=$1 , email=$2 WHERE username=$3 OR email=$4 RETURNING *",
            [username, email, currentUsername, currentEmail]
        )
        if (result.rows.length === 0) {
            res.status(404).send("user nor fund")
        }
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(409).send("the update not complete")

    }
})
router.put("/auth/pass", async (req, res) => {
  const {username,currentpassword,newpassword}=req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username=$1",
        [username]
    )
    const data=result.rows[0];
    if(!data){
        return res.status(403).send("information connot found")
    }
    const compare= await bcrypt.compare(currentpassword,data.password);
    if(!compare){
       return res.status(409).send("uncorrect information");
    }
    const hashpass=await bcrypt.hash(newpassword,10);
    await pool.query("UPDATE users SET password=$1 WHERE username=$2",
        [hashpass,username]
    )
    res.status(200).send("all pross completed")

  } catch (error) {
    console.log(error);
    res.status(500).send("unchange password ")
    
  }
})
module.exports = router;
