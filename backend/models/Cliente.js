module.exports = (sequelize, DataTypes) => {
  const Usuario = require('./Usuario')(sequelize, DataTypes);

  const Cliente = sequelize.define('Cliente', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cuit_cuil: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    localidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
    },
    vendedor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuario,
        key: 'id',
      },
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
    tableName: 'clientes',
    timestamps: false,
  });

  Cliente.belongsTo(Usuario, { as: 'vendedor', foreignKey: 'vendedor_id' });
  Cliente.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuario_id' });

  return Cliente;
};