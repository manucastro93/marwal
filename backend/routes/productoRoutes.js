const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', productoController.crearProducto);
router.put('/:id', productoController.modificarProducto);
router.delete('/:id', productoController.eliminarProducto);
router.get('/', productoController.buscarProductos); // Nueva ruta para buscar productos

module.exports = router;