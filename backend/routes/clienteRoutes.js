const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', clienteController.crearCliente);
router.put('/:id', clienteController.modificarCliente);
router.delete('/:id', clienteController.eliminarCliente);
router.get('/', clienteController.obtenerClientes);
router.get('/clientes/:id', clienteController.obtenerClientePorId);

module.exports = router;