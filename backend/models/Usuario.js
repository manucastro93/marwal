module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
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
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('supremo', 'administrador', 'vendedor'),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      unique: true,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'activo',
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
    tableName: 'usuarios',
    timestamps: false,
  });

  return Usuario;
};