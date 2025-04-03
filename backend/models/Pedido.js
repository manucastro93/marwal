const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Cliente = require('./Cliente');

const Pedido = sequelize.define('pedido', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Cliente,
      key: 'id',
    },
  },
  vendedor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'En Proceso', 'Finalizado', 'Rechazado'),
    defaultValue: 'Pendiente',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at',
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  underscored: true,
});

Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'vendedor_id' });

module.exports = Pedido;