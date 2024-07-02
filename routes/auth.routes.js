const Router = require("express")
const router = new Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("sqlite3").verbose()
const User = require("../models/User")
require('dotenv').config() 
console.log(process.env.MERRY)
const {check, validationResult} = require("express-validator")
router.post("/registration",
    [
        check('email', "Uncorrect email").isEmail(),
    ],
    async (req, res) => {
    
    try{
        console.log(req.body)
        const errors = validationResult(req)
        console.log(errors)
        if(!errors.isEmpty() ){
            return res.status(400).json({message: "Uncorrect request"})
        }
        const {username, email, password} = req.body
        const cryptPassword = await bcrypt.hash(password, 8)
        const user = new User({username, email, password: cryptPassword})
        await user.save()
        return res.status(201).json({ message: "User was created" })


    }catch(err) {
        console.log(err)
        return res.status(500).json({ message: "Server error" });
    }
})


router.post("/login",    
    async (req, res) => {
        try{
            const {username, email, password} = req.body
            const user = await User.findOne({email, username})
            if(!user) {
                return res.status(404).json({message: "User not found"})
            }
            
            const isPassValid = bcrypt.compareSync(password, user.password)
            if(!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            }
            const merry = process.env.MERRY
            const token = jwt.sign({id: user.id}, merry, {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    user: user.username
                }
            })
            
        }catch(err) {
            console.log(err)
        }
})
module.exports = router