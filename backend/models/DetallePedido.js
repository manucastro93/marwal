module.exports = (sequelize, DataTypes) => {
  const DetallePedido = sequelize.define('detallepedido', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id',
      },
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    tableName: 'detalles_pedidos',
    timestamps: true,
    underscored: true,
  });

  DetallePedido.associate = function(models) {
    DetallePedido.belongsTo(models.Pedido, { foreignKey: 'pedido_id' });
    DetallePedido.belongsTo(models.Producto, { foreignKey: 'producto_id' });
  };

  return DetallePedido;
};