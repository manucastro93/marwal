const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');

// Agregar vendedor
router.post('/', vendedorController.agregarVendedor);

// Obtener métricas de vendedores
router.get('/metricas', vendedorController.obtenerMetricasVendedores);

// Modificar vendedor
router.put('/:id', vendedorController.modificarVendedor);

// Eliminar vendedor
router.delete('/:id', vendedorController.eliminarVendedor);

// Obtener vendedores
router.get('/', vendedorController.obtenerVendedores);

// Obtener vendedor por link
router.get('/link/:link', vendedorController.obtenerVendedorPorLink);

// Obtener vendedor por ID
router.get('/:id', vendedorController.obtenerVendedorPorId);



module.exports = router;