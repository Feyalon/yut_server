const sequelize = require('./db');
const User = require('./models/user');
const Post = require('./models/post');
const File = require('./models/file');
const PostFile = require('./models/postFile'); // Если у вас есть промежуточная модель

// Синхронизация всех моделей с базой данных
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Все модели успешно синхронизированы с базой данных.');
  })
  .catch(err => {
    console.error('Ошибка при синхронизации моделей:', err);
  }
);
