// fe/api-session-server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.API_PORT || 3001;

// Session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'spopa-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    },
    name: 'spopa.session.id'
};

// Middleware
app.use(morgan("dev"));
app.use(helmet());

// CORS - Allow requests from React dev server
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // React dev server + self
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Para soportar navegadores legacy
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(sessionConfig));

// Debug middleware
app.use((req, res, next) => {
    if (req.url.startsWith('/api/session')) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        console.log('Session ID:', req.sessionID);
        console.log('Has Session User:', !!req.session?.user);
    }
    next();
});

// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Session API Server is working!',
        timestamp: new Date().toISOString(),
        sessionId: req.sessionID,
        hasUser: !!req.session?.user
    });
});

// Get current session
app.get('/api/session', (req, res) => {
    console.log('GET /api/session - Session data:', req.session);

    if (!req.session.user) {
        return res.status(401).json({
            authenticated: false,
            message: 'No active session'
        });
    }

    res.json({
        authenticated: true,
        user: req.session.user,
        userType: req.session.userType,
        sessionId: req.sessionID
    });
});

// Initialize session
app.post('/api/session/init', (req, res) => {
    console.log('POST /api/session/init - Body:', req.body);

    try {
        const { user, userType } = req.body;

        if (!user || !user.sub) {
            return res.status(400).json({
                error: 'Invalid user data provided'
            });
        }

        // Store user in session
        req.session.user = {
            sub: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture,
            email_verified: user.email_verified
        };

        if (userType) {
            req.session.userType = userType;
        }

        // Save session
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({
                    error: 'Failed to save session'
                });
            }

            console.log('✅ Session saved successfully');

            res.json({
                success: true,
                message: 'Session initialized successfully',
                sessionId: req.sessionID,
                user: req.session.user,
                userType: req.session.userType
            });
        });

    } catch (error) {
        console.error('Session initialization error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update user type
app.put('/api/session/usertype', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: 'No active session'
        });
    }

    const { userType } = req.body;
    const validUserTypes = ['Estudiante', 'Administrativo', 'Empresa'];

    if (!userType || !validUserTypes.includes(userType)) {
        return res.status(400).json({
            error: 'Invalid user type provided',
            validTypes: validUserTypes
        });
    }

    req.session.userType = userType;

    req.session.save((err) => {
        if (err) {
            console.error('Session update error:', err);
            return res.status(500).json({
                error: 'Failed to update session'
            });
        }

        res.json({
            success: true,
            message: 'User type updated successfully',
            userType: req.session.userType
        });
    });
});

// Destroy session
app.delete('/api/session', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({
                error: 'Failed to destroy session'
            });
        }

        res.clearCookie('spopa.session.id');
        res.json({
            success: true,
            message: 'Session destroyed successfully'
        });
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'SPOPA Session API',
        timestamp: new Date().toISOString(),
        port: port
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('API Server Error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

const server = app.listen(port, () => {
    console.log(`🚀 SPOPA Session API Server listening on port ${port}`);
    console.log(`🔗 CORS enabled for: http://localhost:3000`);
    console.log(`📋 Available endpoints:`);
    console.log(`   - GET    http://localhost:${port}/api/test`);
    console.log(`   - GET    http://localhost:${port}/api/health`);
    console.log(`   - GET    http://localhost:${port}/api/session`);
    console.log(`   - POST   http://localhost:${port}/api/session/init`);
    console.log(`   - PUT    http://localhost:${port}/api/session/usertype`);
    console.log(`   - DELETE http://localhost:${port}/api/session`);
});

module.exports = app;