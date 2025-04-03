const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', clienteController.crearOActualizarCliente); 
router.put('/:id', clienteController.modificarCliente);
router.delete('/:id', clienteController.eliminarCliente);
router.get('/', clienteController.obtenerClientes);
router.get('/:id', clienteController.obtenerClientePorId);
router.get('/ip/:ip', clienteController.obtenerClientePorIp);

module.exports = router;