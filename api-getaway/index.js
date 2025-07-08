const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware de seguridad y logging
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: ['process', 'users', 'internships', 'admin']
  });
});

// Rutas existentes (manteniendo tu estructura actual)
app.use('/users', require('./routes/users'));
app.use('/internships', require('./routes/internships'));

// 🆕 Proxy para el microservicio de administración
app.use('/api/admin', createProxyMiddleware({
  target: 'http://api:8000',
  changeOrigin: true,
  pathRewrite: { '^/api/admin': '/api' }, // Reescribe /api/admin/offers -> /api/offers
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

// 🎯 Proxy simple al microservicio independiente
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

// Resto de rutas
app.use('/api/users', createProxyMiddleware({
  target: 'http://users-service:4001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' },
  onError: (err, req, res) => {
    console.error('❌ Error en users:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

app.use('/api/internships', createProxyMiddleware({
  target: 'http://internships-service:4002',
  changeOrigin: true,
  pathRewrite: { '^/api/internships': '/api/internships' },
  onError: (err, req, res) => {
    console.error('❌ Error en internships:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// Frontend estático (opcional)
app.use('/', createProxyMiddleware({
  target: 'https://localhost:3443',
  changeOrigin: true,
  secure: false // permite proxy a servidores con certificados autofirmados 
}));

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Proxy configurado para microservicio independiente`);
  console.log(`🔧 Proxy configurado para microservicio de administración`);
});