const { Sequelize } = require("sequelize")
const sequelize = new Sequelize("users", "projects", "pass", {
    dialect: 'sqlite',
    host: './database.sqlite'
})
module.exports = sequelize
