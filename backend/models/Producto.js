module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('producto', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categorias',
        key: 'id',
      },
    },
    stock: {
      type: DataTypes.INTEGER,
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
    tableName: 'productos', // Nombre de la tabla en minúsculas
    timestamps: true,
    underscored: true, // Utilizar snake_case en lugar de camelCase
  });

  // Definir la relación entre Producto y Categoria
  Producto.associate = function(models) {
    Producto.belongsTo(models.Categoria, { foreignKey: 'categoria_id' });
    Producto.hasMany(models.ImagenProducto, { foreignKey: 'producto_id', as: 'imagenes' });
  };

  return Producto;
};