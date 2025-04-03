const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', pedidoController.crearPedido);
router.put('/:id', pedidoController.modificarEstadoPedido);
router.get('/', pedidoController.obtenerPedidos);
router.post('/:pedidoId/detalles', pedidoController.agregarDetallesPedido);

module.exports = router;