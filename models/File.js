const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Предполагается, что модель User находится в том же каталоге
const Post = require('./Post'); // Предполагается, что модель Post находится в том же каталоге

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(File, { foreignKey: 'userId' });
File.belongsTo(User, { foreignKey: 'userId' });
File.belongsToMany(Post, { through: 'PostFile', foreignKey: 'fileId' });

module.exports = File;
