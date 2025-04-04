const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Crear o actualizar cliente
router.post('/', clienteController.crearOActualizarCliente);

// Obtener métricas de clientes
router.get('/metricas', clienteController.obtenerMetricasClientes);

// Modificar cliente
router.put('/:id', clienteController.modificarCliente);

// Eliminar cliente
router.delete('/:id', clienteController.eliminarCliente);

// Obtener clientes
router.get('/', clienteController.obtenerClientes);

// Obtener cliente por IP
router.get('/ip/:ip', clienteController.obtenerClientePorIp);

// Obtener cliente por ID
router.get('/:id', clienteController.obtenerClientePorId);



module.exports = router;