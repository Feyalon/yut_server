const Router = require("express");
const router = new Router();
const jwt = require("jsonwebtoken");
const {profile, profileDelete, profileUpdate} = require("../controllers/user.controller")

router.get("/profile", profile)
router.post("/profile/update", profileUpdate)

module.exports = router
