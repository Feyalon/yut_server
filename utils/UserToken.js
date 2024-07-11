const jwt = require("jsonwebtoken")
const User = require("../models/User")

const generateTokens = async (user) => {
    try{
        const payload = {id: user.id, username: user.username, email: user.email}
        const accessToken = jwt.sign(payload, process.env.MERRY, {expiresIn: "14m"})
        const refreshToken = jwt.sign(payload, process.env.MERRY, {expiresIn: "30d"})
        
        const userToken = await User.findOne({where: {username: payload.username}})
        if (userToken) {
            // If the user exists, update the refresh token
            userToken.token = refreshToken;
            await userToken.save();
        } else {
            // If the user does not exist, create a new record
            await User.create({ username: payload.username, token: refreshToken });
        }
        return Promise.resolve({accessToken, refreshToken})

    }catch(err) {
        return Promise.reject(err)
    }
}
module.exports = generateTokens