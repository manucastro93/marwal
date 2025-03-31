const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authMiddleware, usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/', authMiddleware, usuarioController.buscarUsuarios);

module.exports = router;