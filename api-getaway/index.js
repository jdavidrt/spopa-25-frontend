const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const app = express();

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS completo con soporte preflight
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Seguridad y logs
app.use(helmet());
app.use(morgan('combined'));

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

// 🔁 Proxy: Admin microservice
app.use('/api/admin', createProxyMiddleware({
  // target: 'http://api:8000', // ← Si se usa Docker Compose con "api", déjarlo. Si no, usar el nombre del contenedor:
  target: 'http://ss_admin_ms-api-1:8000',
  changeOrigin: true,
  pathRewrite: { '^/api/admin': '/api' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxy Admin: Enviando ${req.method} a ${req.url}`);
    if (req.body && Object.keys(req.body).length) {
      console.log('📦 Cuerpo de la solicitud:', req.body);
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Proxy Admin: Respuesta recibida - Status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Error en servicio de admin:', err.message);
    res.status(503).json({ error: 'Servicio de administración no disponible' });
  }
}));

// 🔁 Proxy: Process
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

// 🔁 Proxy: Users
app.use('/api/users', createProxyMiddleware({
  target: 'http://users-service:4001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' },
  onError: (err, req, res) => {
    console.error('❌ Error en users:', err.message);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// 🔁 Proxy: Internships
app.use('/api/internships', createProxyMiddleware({
  target: 'http://internships-service:4002',
  changeOrigin: true,
  pathRewrite: { '^/api/internships': '/api/internships' },
  onError: (err, req, res) => {
    console.error('❌ Error en internships:', err.message);
    res.status(503).json({ error: 'Servicio no disponible' });
  }
}));

// 🔁 Proxy: Frontend (React o similar)
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
