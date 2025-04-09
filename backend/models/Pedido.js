module.exports = (sequelize, DataTypes) => {
  const Cliente = require('./Cliente')(sequelize, DataTypes);
  const Usuario = require('./Usuario')(sequelize, DataTypes);

  const Pedido = sequelize.define('Pedido', {
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
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'En Proceso', 'Finalizado', 'Rechazado'),
      defaultValue: 'Pendiente',
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuario,
        key: 'id',
      },
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
    tableName: 'pedidos',
    timestamps: false,
  });

  return Pedido;
};