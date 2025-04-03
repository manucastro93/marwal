const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const models = {};

// Importar y definir modelos
models.Producto = require('./Producto')(sequelize, Sequelize.DataTypes);
models.ImagenProducto = require('./ImagenProducto')(sequelize, Sequelize.DataTypes);
models.Categoria = require('./Categoria')(sequelize, Sequelize.DataTypes);
models.Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
models.Cliente = require('./Cliente')(sequelize, Sequelize.DataTypes);
models.Pedido = require('./Pedido')(sequelize, Sequelize.DataTypes);
models.DetallePedido = require('./DetallePedido')(sequelize, Sequelize.DataTypes);

// Definir asociaciones
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Exportar modelos y sequelize
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;