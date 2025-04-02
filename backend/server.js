const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const paginaRoutes = require('./routes/paginaRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const imagenRoutes = require('./routes/imagenRoutes');

const app = express();

// Configuración de la sesión
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));


// Middlewares
app.use(cors({
  origin: 'http://localhost:8000', // Reemplaza con el origen de tu frontend
  credentials: true // Permitir que las cookies se envíen a través de CORS
}));

app.use(express.json());

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pagina', paginaRoutes);
app.use('/api/vendedores', vendedorRoutes);
app.use('/api/images', imagenRoutes);

// Conectar a la base de datos y arrancar el servidor sin sincronizar las tablas
sequelize.authenticate().then(() => {
  console.log('Conexión a la base de datos exitosa');
  app.listen(config.port, () => {
    console.log(`Servidor corriendo en el puerto ${config.port}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});