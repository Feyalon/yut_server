const express = require("express")
const app = express()
const sequelize = require("./db")
const User = require("./models/User")
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/files.routes")
sequelize.sync().then(() => {
  console.log("db is ready")
})
app.use(express.json({ extended: false }));
app.use('/api/auth', authRouter, fileRouter)
const port = 3000

app.get("/", (req, res) => {
  res.send("Hello world")
})

app.listen(port, () => {
  console.log("server has been started at 3000 port")
})