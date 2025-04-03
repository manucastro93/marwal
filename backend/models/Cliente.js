const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Cliente = sequelize.define('cliente', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  cuit_cuil: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  dirección: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  localidad: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  provincia: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  ip: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  vendedor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id',
    },
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
  },
}, {
  tableName: 'clientes',
  timestamps: true,
  underscored: true,
});

Cliente.belongsTo(Usuario, { foreignKey: 'vendedor_id', as: 'vendedor' });

module.exports = Cliente;