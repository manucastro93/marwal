module.exports = (sequelize, DataTypes) => {
  const Usuario = require('./Usuario')(sequelize, DataTypes);

  const Logo = sequelize.define('Logo', {
    nombre: {
      type: DataTypes.STRING,
      defaultValue: 'logo_principal',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'logos',
    timestamps: false,
  });

  Logo.belongsTo(Usuario, { foreignKey: 'usuario_id' });

  return Logo;
};