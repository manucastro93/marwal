const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', pedidoController.crearPedidoConDetalles);
router.put('/:id', pedidoController.modificarEstadoPedido);
router.get('/', pedidoController.obtenerPedidos);

module.exports = router;