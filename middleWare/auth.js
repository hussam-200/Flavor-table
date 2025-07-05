require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyingUser(req, res, next) {
    const authhead = req.headers["authorization"];
    if (!authhead) {
        return res.send("plz inter the token")
    }
    const tokenheader = authhead.split(" ")[1];
    const tokenquery = req.query.token;

    const token = tokenheader || tokenquery;
    if (!token) {
        return res.status(401).send("token is missing");
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.user = decode;
        next()
    } catch (error) {
        console.log(error);
        res.status(403).send("invalid or expired token");

    }

} 
module.exports=verifyingUser;