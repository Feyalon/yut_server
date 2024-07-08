const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../db'); // Предполагается, что у вас есть файл соединения с базой данных

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Уникальный индекс для поля username
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,    
    lowercase: true
  },
  token: {
    type: DataTypes.STRING
  }
});

module.exports = User;