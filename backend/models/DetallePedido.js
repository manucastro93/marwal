module.exports = (sequelize, DataTypes) => {
  const Pedido = require('./Pedido')(sequelize, DataTypes);
  const Producto = require('./Producto')(sequelize, DataTypes);

  const DetallePedido = sequelize.define('DetallePedido', {
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
    precio: {
      type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'detalles_pedidos',
    timestamps: false,
  });

  DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });
  DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' });

  return DetallePedido;
};