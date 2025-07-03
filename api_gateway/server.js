// api_gateway/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 8080;

// Environment variables with defaults
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || 'http://localhost:8000';
const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:80'
];

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-User-Type']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Logging
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
            admin: ADMIN_SERVICE_URL
        },
        version: '1.0.0'
    });
});

// API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication middleware (simplified for this example)
const authenticateRequest = (req, res, next) => {
    // Extract user type from headers (set by frontend)
    const userType = req.headers['x-user-type'] || 'guest';
    req.user = { type: userType };

    // Log the request for monitoring
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - User: ${userType}`);

    next();
};

// Request logging middleware
const logRequest = (serviceName) => (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${serviceName}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });

    next();
};

// Admin Service Proxy Configuration
const adminProxyOptions = {
    target: ADMIN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/admin': '/api'
    },
    onProxyReq: (proxyReq, req, res) => {
        // Add custom headers for the downstream service
        proxyReq.setHeader('X-Forwarded-For', req.ip);
        proxyReq.setHeader('X-Gateway-Request-ID', `spopa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

        // Forward user information
        if (req.user) {
            proxyReq.setHeader('X-User-Type', req.user.type);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        // Add response headers
        proxyRes.headers['X-Powered-By'] = 'SPOPA-Gateway';
        proxyRes.headers['X-Service'] = 'Admin';
    },
    onError: (err, req, res) => {
        console.error('Admin service proxy error:', err.message);
        res.status(502).json({
            error: 'Admin service temporarily unavailable',
            message: 'Please try again later',
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-gateway-request-id']
        });
    },
    timeout: 30000,
    proxyTimeout: 30000
};

// Apply middleware and routing
app.use('/api/admin', authenticateRequest, logRequest('ADMIN'), createProxyMiddleware(adminProxyOptions));

// Generic API status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        gateway: 'SPOPA API Gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        services: {
            admin: {
                url: ADMIN_SERVICE_URL,
                status: 'connected'
            }
        }
    });
});

// JMeter testing endpoints
app.get('/api/test/admin/ping', async (req, res) => {
    try {
        const response = await fetch(`${ADMIN_SERVICE_URL}/`);
        const data = await response.json();
        res.json({
            service: 'admin',
            status: 'ok',
            response: data,
            latency: Date.now() - req.startTime
        });
    } catch (error) {
        res.status(503).json({
            service: 'admin',
            status: 'error',
            error: error.message
        });
    }
});

app.get('/api/test/load/:requests', (req, res) => {
    const numRequests = parseInt(req.params.requests) || 1;
    const responses = [];

    for (let i = 0; i < numRequests; i++) {
        responses.push({
            id: i + 1,
            timestamp: new Date().toISOString(),
            data: `Test response ${i + 1}`
        });
    }

    res.json({
        message: `Generated ${numRequests} test responses`,
        responses,
        totalRequests: numRequests
    });
});

// Catch-all for undefined routes
app.all('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        availableEndpoints: [
            'GET /health',
            'GET /api/status',
            'GET /docs',
            'GET|POST|PUT|DELETE /api/admin/*',
            'GET /api/test/admin/ping',
            'GET /api/test/load/:requests'
        ]
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Gateway error:', err);
    res.status(500).json({
        error: 'Internal gateway error',
        message: 'Something went wrong in the API Gateway',
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-gateway-request-id'] || 'unknown'
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SPOPA API Gateway listening on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
    console.log(`🎯 Admin Service: ${ADMIN_SERVICE_URL}`);
});

module.exports = app;