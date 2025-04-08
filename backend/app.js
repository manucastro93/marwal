const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();

const allowedOrigins = [
  'https://catalogo-online-marwal.onrender.com',
  'https://catalogo-online-marwal-cjiq.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });
  console.log('Variables S3:', {
    bucket: process.env.S3_BUCKET_NAME,
    region: process.env.AWS_REGION
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});