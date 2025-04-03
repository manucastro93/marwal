module.exports = (sequelize, DataTypes) => {
  const ImagenProducto = sequelize.define('imagenproducto', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'productos',
        key: 'id',
      },
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
    tableName: 'imagenes_productos', // Nombre de la tabla en minúsculas
    timestamps: true,
    underscored: true, // Utilizar snake_case en lugar de camelCase
  });

  // Definir la relación entre ImagenProducto y Producto
  ImagenProducto.associate = function(models) {
    ImagenProducto.belongsTo(models.Producto, { foreignKey: 'producto_id' });
  };

  return ImagenProducto;
};