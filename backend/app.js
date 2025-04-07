const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();

const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:5000'
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});