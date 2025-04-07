module.exports = (sequelize, DataTypes) => {
  const Notificacion = sequelize.define('Notificacion', {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Notificacion;
};