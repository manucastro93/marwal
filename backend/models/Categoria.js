module.exports = (sequelize, DataTypes) => {
  const Usuario = require('./Usuario')(sequelize, DataTypes);

  const Categoria = sequelize.define('Categoria', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: 'categorias',
    timestamps: false,
  });

  Categoria.belongsTo(Usuario, { foreignKey: 'usuario_id' });

  return Categoria;
};