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
    services: ['process', 'users', 'internships']
  });
});

// Rutas existentes (manteniendo tu estructura actual)
app.use('/users', require('./routes/users'));
app.use('/internships', require('./routes/internships'));


// 🎯 Proxy simple al microservicio independiente
app.use('/api/process', createProxyMiddleware({
  target: 'http://process-ms:4000',  // 👈 Nombre del servicio en la red
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
  target: 'http://localhost:3001',
  changeOrigin: true
}));

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Proxy configurado para microservicio independiente`);
});