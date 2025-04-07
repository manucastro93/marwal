const { check } = require('express-validator');

exports.validarUsuario = [
  check('usuario', 'El nombre de usuario es obligatorio').not().isEmpty(),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  check('telefono', 'El teléfono debe ser válido').isMobilePhone(),
  check('contraseña', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
];

exports.validarCategoria = [
  check('nombre', 'El nombre de la categoría es obligatorio').not().isEmpty(),
];

exports.validarCliente = [
  check('nombre', 'El nombre del cliente es obligatorio').not().isEmpty(),
  check('email', 'El email del cliente es obligatorio').isEmail(),
  check('telefono', 'El teléfono del cliente es obligatorio').not().isEmpty(),
  check('cuit_cuil', 'El CUIT/CUIL del cliente es obligatorio').not().isEmpty(),
];

exports.validarProducto = [
  check('codigo', 'El código del producto es obligatorio').not().isEmpty(),
  check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
  check('precio', 'El precio del producto debe ser un número positivo').isFloat({ min: 0 }),
  check('categoria_id', 'El ID de la categoría es obligatorio').not().isEmpty(),
];

exports.validarPedido = [
  check('cliente_id', 'El ID del cliente es obligatorio').not().isEmpty(),
  check('total', 'El total del pedido debe ser un número positivo').isFloat({ min: 0 }),
];