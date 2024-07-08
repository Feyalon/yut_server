const Router = require("express")
const router = new Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("sqlite3").verbose()
const User = require("../models/User")
require('dotenv').config() 
const {check, validationResult, cookie} = require("express-validator")
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
});


router.post("/login",    
    async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Ищем пользователя по email или username
            const user = await User.findOne({ where: { username: username } });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const salt = bcrypt.genSaltSync()

            // Сравниваем пароль из запроса с хешированным паролем в базе данных
            await bcrypt.hash(password, salt, function(err, hash){
                if(err) res.status(400).json({message: "Invalid password"});
            
                bcrypt.compare(password, user.password, function(err, result) {
                    if (!result) {  return res.status(400).json({ message: "Invalid password" });}
                    const secretKey = process.env.MERRY; // Здесь подставьте ваш секретный ключ для подписи токена
                    const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: "1h" });
                    const refreshToken = jwt.sign({id: user.id, username: user.username, email: user.email}, secretKey, {expiresIn: "30d"})
                    
                    res
                    .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                    .header('Authorization', accessToken)
                    .send("login sucessfull");
                });
                
            });

           

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
        }
    }
);
router.post("/refresh", async (req, res) => {
    try{
        const {username, password, refreshToken} = req.body
        if(res.cookie === refreshToken){
            console.log("hello world")
        }
        
    }catch(err){
        console.log(err)
    }
})
module.exports = router