const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./Pedido');
const Producto = require('./Producto');

const DetallePedido = sequelize.define('detallepedido', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Pedido,
      key: 'id',
    },
  },
  producto_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Producto,
      key: 'id',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at', // Mapear al nombre de columna en la base de datos
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at', // Mapear al nombre de columna en la base de datos
  },
}, {
  tableName: 'detalles_pedidos', // Nombre de la tabla en minúsculas
  timestamps: true,
  underscored: true, // Utilizar snake_case en lugar de camelCase
});

// Definir la relación entre DetallePedido y Pedido
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

// Definir la relación entre DetallePedido y Producto
DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = DetallePedido;