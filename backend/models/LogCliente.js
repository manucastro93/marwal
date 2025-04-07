module.exports = (sequelize, DataTypes) => {
  const Cliente = require('./Cliente')(sequelize, DataTypes);

  const LogCliente = sequelize.define('LogCliente', {
    cliente_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Cliente,
        key: 'id',
      },
    },
    accion: {
      type: DataTypes.ENUM('login', 'logout', 'view_categoria', 'view_producto', 'add_to_cart', 'remove_from_cart', 'checkout', 'contact', 'search', 'account_update'),
      allowNull: false,
    },
    entidad_id: {
      type: DataTypes.INTEGER,
    },
    tipo_entidad: {
      type: DataTypes.ENUM('categoria', 'producto', 'pedido', 'otro'),
    },
    detalles: {
      type: DataTypes.TEXT,
    },
    ip: {
      type: DataTypes.STRING,
    },
    user_agent: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'logs_clientes',
    timestamps: false,
  });

  LogCliente.belongsTo(Cliente, { foreignKey: 'cliente_id' });

  return LogCliente;
};