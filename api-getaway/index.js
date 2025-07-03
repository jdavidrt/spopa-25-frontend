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

// Configuración de servicios con múltiples instancias
const services = {
  process: [
    'http://process-ms-1:4000',
    'http://process-ms-2:4000',
    'http://process-ms-3:4000'
  ],
  admin: ['http://localhost:8000'], 
  offers: ['http://localhost:8010'],
  notifications: ['http://localhost:4001'],
  users: ['http://users-service:4001'],
  internships: ['http://internships-service:4002']
};

// 🔄 Algoritmo Round Robin
const roundRobinCounters = {};

const getRoundRobinTarget = (serviceName) => {
  const targets = services[serviceName];
  if (!targets || targets.length === 0) {
    throw new Error(`No targets available for service: ${serviceName}`);
  }
  
  // Inicializar contador si no existe
  if (!roundRobinCounters[serviceName]) {
    roundRobinCounters[serviceName] = 0;
  }
  
  // Obtener target actual
  const target = targets[roundRobinCounters[serviceName]];
  
  // Incrementar contador para próxima petición
  roundRobinCounters[serviceName] = (roundRobinCounters[serviceName] + 1) % targets.length;
  
  return target;
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: Object.keys(services).map(key => ({
      name: key,
      instances: services[key].length
    }))
  });
});

// Rutas existentes (manteniendo tu estructura actual)
app.use('/users', require('./routes/users'));
app.use('/internships', require('./routes/internships'));

// 🎯 Balanceador de carga con Round Robin
app.use('/api/process', createProxyMiddleware({
  target: 'http://process-ms-1:4000', // Target inicial (será sobrescrito)
  changeOrigin: true,
  pathRewrite: { '^/api/process': '/api/process' },
  router: (req) => {
    const target = getRoundRobinTarget('process');
    console.log(`🔄 Round Robin: Balanceando hacia ${target}`);
    return target;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Balanceador: Enviando petición a ${proxyReq.host}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Balanceador: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en proceso:', err.message);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// Resto de rutas (sin balanceo por ahora)
app.use('/api/admin', createProxyMiddleware({
  target: 'http://localhost:8000',
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
  target: 'http://localhost:8010',
  changeOrigin: true,
  pathRewrite: { '^/api/offers': '/api/offers' },
  onError: (err, req, res) => {
    console.error('❌ Error en offers:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

app.use('/api/notifications', createProxyMiddleware({
  target: 'http://localhost:4001',
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '/api/notifications' },
  onError: (err, req, res) => {
    console.error('❌ Error en notifications:', err);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

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
  console.log(`📊 Balanceando entre ${Object.keys(services).length} servicios`);
  console.log(`🔄 Round Robin configurado para:`);
  Object.keys(services).forEach(service => {
    console.log(`   - ${service}: ${services[service].length} instancias`);
  });
});