module.exports = (sequelize, DataTypes) => {
  const Usuario = require('./Usuario')(sequelize, DataTypes);

  const Banner = sequelize.define('Banner', {
    nombre: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posicion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo',
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
    tableName: 'banners',
    timestamps: false,
  });

  Banner.belongsTo(Usuario, { foreignKey: 'usuario_id' });

  return Banner;
};