const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', pedidoController.crearPedido);
router.get('/', pedidoController.obtenerPedidos);
router.get('/metrics/total-this-month', pedidoController.obtenerTotalPedidosMes);
router.get('/metrics/monthly', pedidoController.obtenerMetricasMensuales);
router.get('/metrics/annual', pedidoController.obtenerMetricasAnuales);
router.get('/metrics/comparar', pedidoController.compararPedidosPorRangoFechas);
router.put('/:id', pedidoController.modificarEstadoPedido);
router.get('/:id', pedidoController.buscarPedidoById);
router.post('/:pedidoId/detalles', pedidoController.agregarDetallesPedido);
router.get('/estado/:estado', pedidoController.obtenerPedidosPorEstado);


module.exports = router;