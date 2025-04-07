module.exports = (sequelize, DataTypes) => {
  const Categoria = require('./Categoria')(sequelize, DataTypes);
  const Usuario = require('./Usuario')(sequelize, DataTypes);

  const Producto = sequelize.define('Producto', {
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Categoria,
        key: 'id',
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'productos',
    timestamps: false,
  });

  Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });
  Producto.belongsTo(Usuario, { foreignKey: 'usuario_id' });

  return Producto;
};