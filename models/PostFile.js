const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Post = require('./post'); // Предполагается, что модель Post находится в том же каталоге
const File = require('./file'); // Предполагается, что модель File находится в том же каталоге

const PostFile = sequelize.define('PostFile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: 'id'
    }
  },
  fileId: {
    type: DataTypes.INTEGER,
    references: {
      model: File,
      key: 'id'
    }
  }
});

Post.belongsToMany(File, { through: PostFile, foreignKey: 'postId' });
File.belongsToMany(Post, { through: PostFile, foreignKey: 'fileId' });

module.exports = PostFile;
