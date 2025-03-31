const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const models = {
  Producto: require('./Producto'),
  ImagenProducto: require('./ImagenProducto'),
  Categoria: require('./Categoria'),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;