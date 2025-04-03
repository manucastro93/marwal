module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('usuario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.CHAR(4),
      unique: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at', // Mapear al nombre de columna en la base de datos
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at', // Mapear al nombre de columna en la base de datos
    },
  }, {
    tableName: 'usuarios', // Nombre de la tabla en minúsculas
    timestamps: true,
    underscored: true, // Utilizar snake_case en lugar de camelCase
  });

  Usuario.associate = function(models) {
    Usuario.hasMany(models.Cliente, { foreignKey: 'vendedor_id' });
    Usuario.hasMany(models.Pedido, { foreignKey: 'vendedor_id' });
  };

  return Usuario;
};