const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Crear producto
router.post('/', productoController.crearProducto);

// Obtener métricas de productos
router.get('/metricas', productoController.obtenerMetricasProductos);

// Modificar producto
router.put('/:id', productoController.modificarProducto);

// Eliminar producto
router.delete('/:id', productoController.eliminarProducto);

// Búsqueda de productos por parámetro
router.get('/', productoController.buscarProductos);


module.exports = router;