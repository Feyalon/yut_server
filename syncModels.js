const sequelize = require('./db');
const User = require('./models/User');
const Post = require('./models/Post');
const File = require('./models/File');
const PostFile = require('./models/PostFile'); // Если у вас есть промежуточная модель

// Синхронизация всех моделей с базой данных
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Все модели успешно синхронизированы с базой данных.');
  })
  .catch(err => {
    console.error('Ошибка при синхронизации моделей:', err);
  }
);
