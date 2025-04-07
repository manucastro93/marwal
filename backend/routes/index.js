const express = require('express');
const router = express.Router();
const { validarToken, validarRol, limitarSolicitudes } = require('../middlewares/authMiddleware');
const { manejarErrores } = require('../middlewares/errorHandler');
const usuarioController = require('../controllers/usuarioController');
const categoriaController = require('../controllers/categoriaController');
const clienteController = require('../controllers/clienteController');
const imagenController = require('../controllers/imagenController');
const paginaController = require('../controllers/paginaController');
const pedidoController = require('../controllers/pedidoController');
const productoController = require('../controllers/productoController');
const vendedorController = require('../controllers/vendedorController');
const administradorController = require('../controllers/administradorController');
const authController = require('../controllers/authController');
const logController = require('../controllers/logController');
const notificacionController = require('../controllers/notificacionController');

const {
  validarUsuario,
  validarCategoria,
  validarCliente,
  validarProducto,
  validarPedido,
} = require('../utils/validators');

// Aplicar limitación de solicitudes a todas las rutas
router.use(limitarSolicitudes);

// Rutas para el usuarioController
router.post('/usuarios', validarToken, validarRol(['administrador', 'supremo']), validarUsuario, usuarioController.crearUsuario);
router.get('/usuarios/me', validarToken, authController.obtenerUsuarioConectado);
router.put('/usuarios/:id', validarToken, validarRol(['administrador', 'supremo']), validarUsuario, usuarioController.editarUsuario);
router.delete('/usuarios/:id', validarToken, validarRol(['administrador', 'supremo']), usuarioController.eliminarUsuario);
router.get('/usuarios', validarToken, validarRol(['administrador', 'supremo']), usuarioController.buscarUsuarios);
router.get('/usuarios/:id', validarToken, validarRol(['administrador', 'supremo']), usuarioController.buscarUsuarioPorId);
router.post('/login', authController.loginUsuario);
router.post('/logout', validarToken, authController.logoutUsuario);

// Rutas para el categoriaController
router.post('/categorias', validarToken, validarRol(['administrador', 'supremo']), validarCategoria, categoriaController.crearCategoria);
router.put('/categorias/:id', validarToken, validarRol(['administrador', 'supremo']), validarCategoria, categoriaController.editarCategoria);
router.delete('/categorias/:id', validarToken, validarRol(['administrador', 'supremo']), categoriaController.eliminarCategoria);
router.get('/categorias', validarToken, categoriaController.buscarCategorias);

// Rutas para el clienteController
router.put('/clientes/:id', validarToken, validarRol(['vendedor', 'administrador', 'supremo']), validarCliente, clienteController.editarCliente);
router.get('/clientes', validarToken, validarRol(['vendedor', 'administrador', 'supremo']), clienteController.buscarClientes);
router.get('/clientes/ip/:ip', validarToken, validarRol(['vendedor', 'administrador', 'supremo']), clienteController.buscarClientePorIp);
router.get('/clientes/:id', validarToken, validarRol(['vendedor', 'administrador', 'supremo']), clienteController.buscarClientePorId);
router.get('/metricas/clientes', validarToken, validarRol(['administrador', 'supremo']), clienteController.buscarMetricasClientes);

// Rutas para el imagenController
router.post('/imagenes', validarToken, validarRol(['administrador', 'supremo']), imagenController.subirImagen);
router.delete('/imagenes/:id', validarToken, validarRol(['administrador', 'supremo']), imagenController.eliminarImagen);

// Rutas para el paginaController
router.get('/banners', validarToken, validarRol(['administrador', 'supremo']), paginaController.buscarBanners);
router.post('/banners', validarToken, validarRol(['administrador', 'supremo']), paginaController.crearBanner);
router.delete('/banners/:id', validarToken, validarRol(['administrador', 'supremo']), paginaController.eliminarBanner);
router.get('/logo', validarToken, paginaController.buscarLogo);

// Rutas para el pedidoController
router.put('/pedidos/:id/estado', validarToken, validarRol(['administrador', 'supremo']), pedidoController.modificarEstadoPedido);
router.get('/pedidos', validarToken, validarRol(['vendedor', 'administrador', 'supremo']), pedidoController.buscarPedidos);
router.get('/pedidos/:id', validarToken, validarRol(['vendedor', 'administrador', 'supremo']), pedidoController.buscarPedidoPorId);
router.get('/pedidos/estado/:estado', validarToken, validarRol(['vendedor', 'administrador', 'supremo']), pedidoController.buscarPedidosPorEstado);
router.get('/pedidos/total/mes', validarToken, validarRol(['administrador', 'supremo']), pedidoController.buscarTotalPedidosMes);
router.get('/pedidos/total/dia', validarToken, validarRol(['administrador', 'supremo']), pedidoController.buscarTotalPedidosDia);
router.get('/pedidos/total/anual', validarToken, validarRol(['administrador', 'supremo']), pedidoController.buscarTotalPedidosAnual);
router.post('/pedidos/rango', validarToken, validarRol(['administrador', 'supremo']), pedidoController.buscarPedidosRangoFechas);
router.get('/pedidos/vendedor/:vendedor_id', validarToken, validarRol(['administrador', 'supremo']), pedidoController.buscarPedidosPorVendedor);
router.get('/pedidos/producto/:producto_id', validarToken, validarRol(['administrador', 'supremo']), pedidoController.buscarPedidosPorProducto);
router.get('/pedidos/categoria/:categoria_id', validarToken, validarRol(['administrador', 'supremo']), pedidoController.buscarPedidosPorCategoria);

// Rutas para el productoController
router.post('/productos', validarToken, validarRol(['administrador', 'supremo']), validarProducto, productoController.crearProducto);
router.put('/productos/:id', validarToken, validarRol(['administrador', 'supremo']), validarProducto, productoController.editarProducto);
router.delete('/productos/:id', validarToken, validarRol(['administrador', 'supremo']), productoController.eliminarProducto);
router.get('/productos', validarToken, productoController.buscarProductos);
router.get('/productos/:id', validarToken, productoController.buscarProductoPorId);
router.get('/productos/nombre/:nombre', validarToken, productoController.buscarProductoPorNombre);
router.get('/productos/categoria/:categoria_id', validarToken, productoController.buscarProductoPorCategoria);

// Rutas para el vendedorController
router.post('/vendedores', validarToken, validarRol(['administrador', 'supremo']), validarUsuario, vendedorController.crearVendedor);
router.put('/vendedores/:id', validarToken, validarRol(['administrador', 'supremo']), validarUsuario, vendedorController.editarVendedor);
router.delete('/vendedores/:id', validarToken, validarRol(['administrador', 'supremo']), vendedorController.eliminarVendedor);
router.get('/vendedores', validarToken, validarRol(['administrador', 'supremo']), vendedorController.buscarVendedores);
router.get('/vendedores/:id', validarToken, validarRol(['administrador', 'supremo']), vendedorController.buscarVendedorPorId);

// Rutas para el administradorController
router.post('/administradores', validarToken, validarRol(['supremo']), validarUsuario, administradorController.crearAdministrador);
router.put('/administradores/:id', validarToken, validarRol(['supremo']), validarUsuario, administradorController.editarAdministrador);
router.delete('/administradores/:id', validarToken, validarRol(['supremo']), administradorController.eliminarAdministrador);
router.get('/administradores', validarToken, validarRol(['supremo']), administradorController.buscarAdministradores);
router.get('/administradores/:id', validarToken, validarRol(['supremo']), administradorController.buscarAdministradorPorId);

// Rutas para el logController
router.post('/logs', validarToken, validarRol(['supremo', 'administrador']), logController.crearLog);
router.get('/logs', validarToken, validarRol(['supremo', 'administrador']), logController.buscarLogs);

// Rutas para el notificacionController
router.post('/notificaciones', validarToken, validarRol(['supremo', 'administrador']), notificacionController.crearNotificacion);
router.get('/notificaciones', validarToken, notificacionController.buscarNotificaciones);
router.put('/notificaciones/:id/leida', validarToken, notificacionController.marcarNotificacionLeida);

// Middleware para manejo de errores
router.use(manejarErrores);

module.exports = router;