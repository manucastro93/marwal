const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const Categoria = require('./Categoria')(sequelize, Sequelize.DataTypes);
const Cliente = require('./Cliente')(sequelize, Sequelize.DataTypes);
const ImagenProducto = require('./ImagenProducto')(sequelize, Sequelize.DataTypes);
const LogCliente = require('./LogCliente')(sequelize, Sequelize.DataTypes);
const Notificacion = require('./Notificacion')(sequelize, Sequelize.DataTypes);
const Pedido = require('./Pedido')(sequelize, Sequelize.DataTypes);
const DetallePedido = require('./DetallePedido')(sequelize, Sequelize.DataTypes);
const Producto = require('./Producto')(sequelize, Sequelize.DataTypes);
const Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
const Banner = require('./Banner')(sequelize, Sequelize.DataTypes);
const Logo = require('./Logo')(sequelize, Sequelize.DataTypes);
const IP = require('./IP')(sequelize, Sequelize.DataTypes);

// Definir asociaciones
Cliente.hasMany(Pedido, { foreignKey: 'cliente_id' });
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id' });

Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });

Pedido.belongsToMany(Producto, { through: 'PedidoProducto', foreignKey: 'pedido_id' });
Producto.belongsToMany(Pedido, { through: 'PedidoProducto', foreignKey: 'producto_id' });

Producto.hasMany(ImagenProducto, {foreignKey: 'producto_id',as: 'imagenes',});
ImagenProducto.belongsTo(Producto, { foreignKey: 'producto_id' });

Cliente.belongsTo(Usuario, { foreignKey: 'vendedor_id' });
Usuario.hasMany(Cliente, { foreignKey: 'vendedor_id' });

Producto.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Pedido.belongsTo(Usuario, { as: 'vendedor', foreignKey: 'vendedor_id' });
Pedido.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuario_id' });

Logo.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Pedido.hasMany(DetallePedido, { foreignKey: 'pedido_id' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });
DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' });

Categoria.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Cliente.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuario_id' });

Banner.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Cliente.hasMany(IP, { foreignKey: 'cliente_id' });
IP.belongsTo(Cliente, { foreignKey: 'cliente_id' });

module.exports = {
  sequelize,
  Categoria,
  Cliente,
  ImagenProducto,
  LogCliente,
  Notificacion,
  Pedido,
  Producto,
  Usuario,
  Banner,
  Logo
};