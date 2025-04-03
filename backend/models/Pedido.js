module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('pedido', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'clientes',
        key: 'id',
      },
    },
    vendedor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'En Proceso', 'Finalizado', 'Rechazado', 'Cancelado'),
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

  Pedido.associate = function(models) {
    Pedido.belongsTo(models.Cliente, { foreignKey: 'cliente_id' });
    Pedido.belongsTo(models.Usuario, { foreignKey: 'vendedor_id' });
    Pedido.hasMany(models.DetallePedido, { as: 'detalles', foreignKey: 'pedido_id' });
  };

  return Pedido;
};