// fe/server.js - Updated for Docker environment
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { join } = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = process.env.SERVER_PORT || 3001;

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:8080';
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || 'http://localhost:8080/api/admin';

console.log(`🚀 Starting SPOPA Frontend Server`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔗 API Gateway: ${API_GATEWAY_URL}`);

// Session configuration with fallback
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'spopa-development-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? 'strict' : 'lax'
  },
  name: 'spopa.session.id'
};

// Trust proxy for production deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.auth0.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://stackpath.bootstrapcdn.com", "https://cdn.auth0.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "https://dev-csthezp5ifz25yr6.us.auth0.com",
        API_GATEWAY_URL,
        ADMIN_SERVICE_URL
      ]
    }
  }
}));

// CORS configuration
const corsOrigins = isProduction
  ? [process.env.FRONTEND_URL || 'https://spopa.com']
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-User-Type']
}));

// Logging middleware
app.use(morgan(isProduction ? "combined" : "dev"));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Session middleware
app.use(session(sessionConfig));

// Custom middleware to add API Gateway URL to requests
app.use((req, res, next) => {
  req.apiGateway = API_GATEWAY_URL;
  req.adminService = ADMIN_SERVICE_URL;
  next();
});

// Session debugging middleware (development only)
if (!isProduction) {
  app.use((req, res, next) => {
    if (req.url.startsWith('/api/session')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      console.log('Session ID:', req.sessionID);
    }
    next();
  });
}

// Session management routes
app.post('/api/session/login', (req, res) => {
  const { user, userType } = req.body;

  if (!user || !userType) {
    return res.status(400).json({ error: 'User and userType are required' });
  }

  req.session.user = user;
  req.session.userType = userType;

  res.json({
    message: 'Session created successfully',
    user: req.session.user,
    userType: req.session.userType
  });
});

app.post('/api/session/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to destroy session' });
    }
    res.clearCookie(sessionConfig.name);
    res.json({ message: 'Session destroyed successfully' });
  });
});

app.get('/api/session/status', (req, res) => {
  res.json({
    authenticated: !!req.session?.user,
    user: req.session?.user || null,
    userType: req.session?.userType || null,
    sessionId: req.sessionID
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiGateway: API_GATEWAY_URL,
    session: {
      configured: !!sessionConfig,
      hasSessionId: !!req.sessionID,
      authenticated: !!req.session?.user
    }
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Frontend API is working',
    timestamp: new Date().toISOString(),
    sessionId: req.sessionID,
    apiGateway: API_GATEWAY_URL,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Protected API endpoint example
app.get('/api/protected', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  res.json({
    message: 'This is a protected endpoint',
    user: req.session.user,
    userType: req.session.userType
  });
});

// Proxy middleware for API Gateway communication
if (process.env.NODE_ENV !== 'production') {
  try {
    const { createProxyMiddleware } = require('http-proxy-middleware');

    // Proxy requests to API Gateway
    app.use('/api/gateway', createProxyMiddleware({
      target: API_GATEWAY_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/gateway': '' },
      onProxyReq: (proxyReq, req, res) => {
        // Forward session information
        if (req.session?.user) {
          proxyReq.setHeader('X-User-Type', req.session.userType);
          proxyReq.setHeader('X-User-ID', req.session.user.sub || req.session.user.id);
        }
      },
      onError: (err, req, res) => {
        console.error('API Gateway proxy error:', err.message);
        res.status(502).json({ error: 'API Gateway unavailable' });
      }
    }));

    // Direct proxy to admin service through gateway
    app.use('/api/admin', createProxyMiddleware({
      target: API_GATEWAY_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/admin': '/api/admin' },
      onProxyReq: (proxyReq, req, res) => {
        if (req.session?.user) {
          proxyReq.setHeader('X-User-Type', req.session.userType);
        }
      },
      onError: (err, req, res) => {
        console.error('Admin service proxy error:', err.message);
        res.status(502).json({ error: 'Admin service unavailable' });
      }
    }));

    console.log('✅ Proxy middleware configured successfully');
  } catch (error) {
    console.warn('⚠️  Proxy middleware not available:', error.message);
  }
}

// Serve static files from the React app build
app.use(express.static(join(__dirname, "build")));

// Catch-all handler for React Router
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  const indexPath = join(__dirname, "build", "index.html");

  if (fs.existsSync(indexPath)) {
    // Add session data to the HTML for client-side hydration
    let htmlContent = fs.readFileSync(indexPath, 'utf8');

    const sessionData = {
      authenticated: !!req.session?.user,
      user: req.session?.user || null,
      userType: req.session?.userType || null,
      apiGateway: API_GATEWAY_URL
    };

    // Inject session data into HTML
    htmlContent = htmlContent.replace(
      '<head>',
      `<head><script>window.__INITIAL_SESSION__ = ${JSON.stringify(sessionData)};</script>`
    );

    res.send(htmlContent);
  } else {
    // Fallback if build doesn't exist
    res.json({
      message: 'SPOPA Frontend Server',
      note: 'React build not found. Run `npm run build` to generate static files.',
      api: {
        health: '/api/health',
        test: '/api/test',
        session: '/api/session/status'
      }
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: isProduction ? 'Something went wrong' : err.message
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🎭 SPOPA Frontend Server listening on port ${port}`);
  console.log(`🔗 API Gateway: ${API_GATEWAY_URL}`);
  console.log(`🛡️  Admin Service: ${ADMIN_SERVICE_URL}`);
  console.log(`📊 Health Check: http://localhost:${port}/api/health`);
});

module.exports = app;