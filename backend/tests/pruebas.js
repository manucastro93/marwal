const request = require('supertest');
const { expect } = require('chai');
const app = require('../app'); // Asegúrate de que este sea el path correcto a tu archivo principal de la aplicación

describe('API Tests', () => {
  it('debería crear un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('x-auth-token', 'your-token-here') // Reemplaza con un token válido
      .send({
        usuario: 'testuser',
        nombre: 'Test User',
        email: 'testuser@example.com',
        telefono: '1234567890',
        contraseña: 'password123',
        rol: 'vendedor',
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  it('debería obtener todos los usuarios', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('x-auth-token', 'your-token-here'); // Reemplaza con un token válido
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('debería obtener un usuario por ID', async () => {
    const res = await request(app)
      .get('/api/usuarios/1')
      .set('x-auth-token', 'your-token-here'); // Reemplaza con un token válido
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
  });

  it('debería marcar una notificación como leída', async () => {
    const res = await request(app)
      .put('/api/notificaciones/1/leida')
      .set('x-auth-token', 'your-token-here'); // Reemplaza con un token válido
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('leida', true);
  });
});