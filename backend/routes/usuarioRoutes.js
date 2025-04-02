const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authMiddleware, usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.post('/logout', usuarioController.logoutUsuario);
router.get('/current', authMiddleware, usuarioController.getCurrentUser); // Agregar authMiddleware aquí
router.get('/', authMiddleware, usuarioController.buscarUsuarios);
router.post('/renovar-token', authMiddleware, usuarioController.renovarToken); // Agregar authMiddleware aquí

module.exports = router;