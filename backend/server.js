const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const paginaRoutes = require('./routes/paginaRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pagina', paginaRoutes);
app.use('/api/vendedores', vendedorRoutes);

// Conectar a la base de datos y arrancar el servidor sin sincronizar las tablas
sequelize.authenticate().then(() => {
  console.log('Conexión a la base de datos exitosa');
  app.listen(config.port, () => {
    console.log(`Servidor corriendo en el puerto ${config.port}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});