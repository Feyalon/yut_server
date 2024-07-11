const jwt = require("jsonwebtoken");
const User = require("../models/User");

const reissueAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      console.log(refreshToken);
    }

    const decoded = jwt.verify(refreshToken, process.env.MERRY);

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user || user.token !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const payload = { id: user.id, username: user.username, email: user.email };
    const newAccessToken = jwt.sign(payload, process.env.MERRY, {
      expiresIn: "14m",
    });

    return { accessToken: newAccessToken };
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = reissueAccessToken;
