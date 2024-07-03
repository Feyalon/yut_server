const Router = require("express")
const router = new Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("sqlite3").verbose()
const User = require("../models/User")
require('dotenv').config() 
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
        try {
            const { username, email, password } = req.body;

            // Ищем пользователя по email или username
            const user = await User.findOne({ username  });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const salt = bcrypt.genSaltSync()

            // Сравниваем пароль из запроса с хешированным паролем в базе данных
            const isMatch = await bcrypt.hash(password, salt, function(err, hash){
                if(err) throw err;
            
                bcrypt.compare(password, user.password, function(err, result) {
                  if (err) {  return res.status(400).json({ message: "Invalid password" });}
                  const secretKey = process.env.MERRY; // Здесь подставьте ваш секретный ключ для подписи токена
                  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
      
                  // Устанавливаем токен в куку
                  res.cookie("token", token, {
                      httpOnly: true,
                      // secure: true, // Расскомментируйте, если используете HTTPS
                      // sameSite: 'none' // Расскомментируйте, если требуется кросс-доменная установка кук
                  });
      
                  // Возвращаем успешный ответ
                  return res.status(200).json({ message: "Login successful", token });
                });
                
            });

           

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
        }
    }
);
module.exports = router