const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.enviarConfirmacionPedido = async ({ pedido, cliente, detalles }) => {
  const total = detalles.reduce((acc, d) => acc + d.precio * d.cantidad, 0);
  const texto = detalles
    .map(d => `Producto ID: ${d.producto_id}, Cantidad: ${d.cantidad}, Precio: ${d.precio}`)
    .join('\n');

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: cliente.email,
    subject: `Confirmación de Pedido #${pedido.id}`,
    text: `Hola ${cliente.nombre},\n\nTu pedido fue recibido correctamente.\n\n${texto}\n\nTotal: $${total}`
  });
};
