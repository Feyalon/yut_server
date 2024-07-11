const Router = require("express");
const router = new Router();
const jwt = require("jsonwebtoken");

router.get("/profile", (req, res) => {
    const authHeader = req.headers['authorization']
    const refreshToken = req.cookies.refreshToken
    res.send(refreshToken)
})
module.exports = router