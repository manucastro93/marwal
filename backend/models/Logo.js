const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Logo = sequelize.define('logo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
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
  tableName: 'logo', // Nombre de la tabla en minúsculas
  timestamps: true,
  underscored: true, // Utilizar snake_case en lugar de camelCase
});

module.exports = Logo;