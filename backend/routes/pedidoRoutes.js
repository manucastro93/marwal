const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, pedidoController.crearPedido);
router.put('/:id', authMiddleware, pedidoController.modificarEstadoPedido);
router.get('/', authMiddleware, pedidoController.obtenerPedidos);

module.exports = router;