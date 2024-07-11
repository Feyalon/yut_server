const Router = require("express");
const router = new Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("sqlite3").verbose();
const User = require("../models/User");

require("dotenv").config();
const { check, validationResult, cookie } = require("express-validator");
const generateTokens = require("../utils/UserToken");
const reissueAccessToken = require("../utils/refreshToken");

router.post(
  "/registration",
  [check("email", "Uncorrect email").isEmail()],
  async (req, res) => {
    try {
      console.log(req.body);
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Uncorrect request" });
      }

      const { username, email, password } = req.body;

      const cryptPassword = await bcrypt.hash(password, 8);
      const user = new User({ username, email, password: cryptPassword });
      await user.save();
      return res.status(201).json({ message: "User was created" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
); // registration

router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ищем пользователя по email или username
    const user = await User.findOne({ where: { username: username } });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salt = bcrypt.genSaltSync();

    // Сравниваем пароль из запроса с хешированным паролем в базе данных
    await bcrypt.hash(password, salt, function (err, hash) {
      if (err) res.status(400).json({ message: "Invalid password" });

      bcrypt.compare(password, user.password, async function (err, result) {
        if (!result) {
          return res.status(400).json({ message: "Invalid password" });
        }
        const secretKey = process.env.MERRY; // Здесь подставьте ваш секретный ключ для подписи токена
        const promiseToken = generateTokens(user);
        const tokens = await promiseToken
        res
          .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .header("Authorization", tokens.accessToken)
          .send("login sucessfull");
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
}); // login

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken  = req.cookies.refreshToken;
    console.log(refreshToken)
    try {
      const tokens = await reissueAccessToken(refreshToken);
      res.json(tokens.accessToken);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
