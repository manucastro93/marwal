module.exports = (sequelize, DataTypes) => {
    const IP = sequelize.define('IP', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'ips',
      underscored: true,
    });
  
  
    return IP;
  };
  