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

// Configuración de servicios con balanceo (URLs corregidas para Docker)
const services = {
  process: ['http://process-ms:4000'],  // 👈 Cambió de localhost a process-ms
  admin: ['http://localhost:8000'], 
  offers: ['http://localhost:8010'],
  notifications: ['http://localhost:4001'],
  users: ['http://users-service:4001'],  // 👈 Cambió de localhost a users-service
  internships: ['http://internships-service:4002']  // 👈 Cambió de localhost a internships-service
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rutas existentes (manteniendo tu estructura actual)
app.use('/users', require('./routes/users'));
app.use('/internships', require('./routes/internships'));

// Rutas con balanceo de carga (CORREGIDAS - CON LOGS AGREGADOS)
app.use('/api/process', createProxyMiddleware({
  target: 'http://process-ms:4000',  // 👈 Target fijo
  changeOrigin: true,
  pathRewrite: { '^/api/process': '/api/process' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Balanceador: Enviando petición a process-ms:4000');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Balanceador: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en proceso:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

app.use('/api/admin', createProxyMiddleware({
  target: 'http://localhost:8000',  // 👈 Target fijo
  changeOrigin: true,
  pathRewrite: { '^/api/admin': '/api' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Balanceador: Enviando petición a localhost:8000');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Balanceador: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en admin:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

app.use('/api/offers', createProxyMiddleware({
  target: 'http://localhost:8010',  // 👈 Target fijo
  changeOrigin: true,
  pathRewrite: { '^/api/offers': '/api/offers' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Balanceador: Enviando petición a localhost:8010');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Balanceador: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en offers:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

app.use('/api/notifications', createProxyMiddleware({
  target: 'http://localhost:4001',  // 👈 Target fijo
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '/api/notifications' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Balanceador: Enviando petición a localhost:4001');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Balanceador: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en notifications:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// Proxy para usuarios (usando nombres de servicios Docker)
app.use('/api/users', createProxyMiddleware({
  target: 'http://users-service:4001',  // 👈 Target fijo
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Balanceador: Enviando petición a users-service:4001');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Balanceador: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en users:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// Proxy para internships (usando nombres de servicios Docker)
app.use('/api/internships', createProxyMiddleware({
  target: 'http://internships-service:4002',  // 👈 Target fijo
  changeOrigin: true,
  pathRewrite: { '^/api/internships': '/api/internships' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('🔄 Balanceador: Enviando petición a internships-service:4002');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Balanceador: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en internships:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// Frontend estático (opcional)
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}));

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Balanceando entre ${Object.keys(services).length} servicios`);
});