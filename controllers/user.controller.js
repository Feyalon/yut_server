const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
const profile = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const result = jwtDecode(token);
    res.send({
      username: result.username,
      email: result.email,
    });
  } catch (err) {
    console.log(err);
    res.status(401);
  }
};

module.exports = { profile };
