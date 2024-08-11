const Router = require("express");
const router = new Router();
const {
  registration,
  login,
  refresh_token,
} = require("../controllers/auth.controller");

router.post(
  "/registration",
  registration
);

router.post("/login", login);

router.post("/refresh", refresh_token);

module.exports = router;
