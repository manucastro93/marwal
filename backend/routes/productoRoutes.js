const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, productoController.crearProducto);
router.put('/:id', authMiddleware, productoController.modificarProducto);
router.delete('/:id', authMiddleware, productoController.eliminarProducto);
router.get('/', productoController.buscarProductos); // Nueva ruta para buscar productos

module.exports = router;