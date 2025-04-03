module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('categoria', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  }, {
    tableName: 'categorias',
    timestamps: true,
    underscored: true,
  });

  Categoria.associate = function(models) {
    Categoria.hasMany(models.Producto, { foreignKey: 'categoria_id' });
  };

  return Categoria;
};