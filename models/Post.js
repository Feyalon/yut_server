const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Предполагается, что модель User находится в том же каталоге
const File = require('./File'); // Предполагается, что модель File находится в том же каталоге

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
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

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
Post.belongsToMany(File, { through: 'PostFile', foreignKey: 'postId' });

module.exports = Post;
