module.exports = (sequelize, DataTypes) => {
    const Cliente = require('./Cliente')(sequelize, DataTypes);
  
    const Ip = sequelize.define('Ip', {
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Cliente,
          key: 'id',
        },
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'ips',
      timestamps: false,
    });
  
    Ip.belongsTo(Cliente, { foreignKey: 'cliente_id' });
  
    return Ip;
  };
  