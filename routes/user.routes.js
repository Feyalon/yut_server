const Router = require("express");
const router = new Router();
const jwt = require("jsonwebtoken");
const {profile} = require("../controllers/user.controller")

router.get("/profile", profile)
module.exports = router