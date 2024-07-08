const jwt = require("jsonwebtoken")
const User = require("../models/User")

const generateTokens = async (user) => {
    try{
        const payload = {id: user.id, username: user.username, email: user.email}
        const accessToken = jwt.sign(payload, process.env.MERRY, {expiresIn: "14m"})
        const refreshToken = jwt.sign(payload, process.env.MERRY, {expiresIn: "30d"})
        const userToken = await User.findOne({where: {username: user.username}})
        if (userToken) await userToken.remove();
        await new User({where: {username: user.username}}, {token: refreshToken}).save()
        return Promise.resolve({accessToken, refreshToken})

    }catch(err) {
        return Promise.reject(err)
    }
}
module.exports = generateTokens