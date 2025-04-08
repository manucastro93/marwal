const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { sequelize } = require('./models');

// Configuración inicial
dotenv.config();
const app = express();

// 1. Configuración de proxy (para Render y rate-limiting)
app.set('trust proxy', 1); // Nivel 1 de proxy (solo Render)

// 2. CORS Configuration
const allowedOrigins = [
  'https://catalogo-online-marwal.onrender.com',
  'https://catalogo-online-marwal-cjiq.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 3. Rate Limiting (Protección contra abuso)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite por IP
  message: { 
    error: 'Too many requests, please try again later' 
  },
  validate: { 
    trustProxy: false // Compatible con trust proxy de Express
  }
});

// 4. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Aplicar rate-limiting solo a /api
app.use('/api', apiLimiter, routes);

// 6. Database Sync
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    
    // 7. Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
      console.log('🛠️ Variables de entorno:', {
        node_env: process.env.NODE_ENV,
        s3_bucket: process.env.S3_BUCKET_NAME,
        aws_region: process.env.AWS_REGION
      });
    });
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar la base de datos:', error);
    process.exit(1); // Detener la aplicación si hay error en DB
  });

// 8. Manejo de errores global
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
  process.exit(1);
});