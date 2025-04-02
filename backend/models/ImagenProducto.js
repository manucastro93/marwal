const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Producto = require('./Producto');

const ImagenProducto = sequelize.define('imagenproducto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  producto_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Producto,
      key: 'id',
    },
    allowNull: false,
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
    allowNull: true, // Permitir valores nulos si es necesario
    field: 'updated_at', // Mapear al nombre de columna en la base de datos
  },
}, {
  tableName: 'imagenes_productos', // Nombre de la tabla en minúsculas
  timestamps: true,
  underscored: true, // Utilizar snake_case en lugar de camelCase
});

// Definir la relación entre ImagenProducto y Producto
ImagenProducto.associate = (models) => {
  ImagenProducto.belongsTo(models.Producto, { foreignKey: 'producto_id', as: 'producto' });
};

module.exports = ImagenProducto;