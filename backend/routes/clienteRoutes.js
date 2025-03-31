const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, clienteController.crearCliente);
router.put('/:id', authMiddleware, clienteController.modificarCliente);
router.delete('/:id', authMiddleware, clienteController.eliminarCliente);
router.get('/', authMiddleware, clienteController.obtenerClientes); // Ruta combinada para obtener clientes

module.exports = router;