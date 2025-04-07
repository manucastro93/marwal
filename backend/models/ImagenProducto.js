module.exports = (sequelize, DataTypes) => {
  const Producto = require('./Producto')(sequelize, DataTypes);

  const ImagenProducto = sequelize.define('ImagenProducto', {
    producto_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Producto,
        key: 'id',
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'imagenes_productos',
    timestamps: false,
  });

  ImagenProducto.belongsTo(Producto, { foreignKey: 'producto_id' });

  return ImagenProducto;
};