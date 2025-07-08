const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// ✅ Configuración explícita de CORS
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Soporte para preflight (OPTIONS)

// Middleware de seguridad y logging
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: ['process', 'users', 'internships', 'admin']
  });
});

// Rutas locales
app.use('/users', require('./routes/users'));
app.use('/internships', require('./routes/internships'));

// 🔁 Proxy para el microservicio de administración
app.use('/api/admin', createProxyMiddleware({
  target: 'http://api:8000',
  changeOrigin: true,
  pathRewrite: { '^/api/admin': '/api' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Proxy Admin: Enviando petición a microservicio de administración');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Proxy Admin: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en servicio de admin:', err.message);
    res.status(503).json({ error: 'Servicio de administración no disponible' });
  }
}));

// Proxy al microservicio independiente de procesos
app.use('/api/process', createProxyMiddleware({
  target: 'http://process-ms:4000',
  changeOrigin: true,
  pathRewrite: { '^/api/process': '/api/process' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Proxy: Enviando petición a microservicio independiente');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Proxy: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en proceso:', err.message);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// Proxy para users
app.use('/api/users', createProxyMiddleware({
  target: 'http://users-service:4001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' },
  onError: (err, req, res) => {
    console.error('❌ Error en users:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// Proxy para internships
app.use('/api/internships', createProxyMiddleware({
  target: 'http://internships-service:4002',
  changeOrigin: true,
  pathRewrite: { '^/api/internships': '/api/internships' },
  onError: (err, req, res) => {
    console.error('❌ Error en internships:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// Proxy para frontend (opcional)
app.use('/', createProxyMiddleware({
  target: 'https://localhost:3443',
  changeOrigin: true,
  secure: false
}));

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Proxy configurado para microservicio independiente`);
  console.log(`🔧 Proxy configurado para microservicio de administración`);
});
