#!/bin/bash
# setup.sh - Quick setup script for SPOPA system

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                 SPOPA System Setup                    ║"
echo "║          Quick Deployment Script                      ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Create necessary directories
print_step "Creating project directories..."
mkdir -p api_gateway
mkdir -p nginx/conf.d
mkdir -p nginx/ssl
mkdir -p nginx/html
mkdir -p mongo-init
mkdir -p logs
mkdir -p jmeter
mkdir -p results
print_success "Directories created"

# Create MongoDB initialization script
print_step "Creating MongoDB initialization script..."
cat > mongo-init/init-mongo.js << 'EOF'
// MongoDB initialization script for SPOPA
db = db.getSiblingDB('spopa_admin');

// Create collections
db.createCollection('offers');
db.createCollection('users');

// Create indexes
db.offers.createIndex({ "title": "text", "company": "text", "description": "text" });
db.offers.createIndex({ "createdAt": 1 });
db.offers.createIndex({ "company": 1 });

// Insert sample data
db.offers.insertMany([
    {
        title: "Full-Stack Developer Intern",
        company: "TechCorp Solutions",
        description: "Join our dynamic team to work on cutting-edge web applications",
        requirements: ["JavaScript", "React", "Node.js", "MongoDB"],
        location: "Bogotá, Colombia",
        salary: 2800000,
        duration: "6 months",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Data Science Intern",
        company: "Analytics Pro",
        description: "Work with big data and machine learning algorithms",
        requirements: ["Python", "Pandas", "Scikit-learn", "SQL"],
        location: "Medellín, Colombia",
        salary: 3200000,
        duration: "4 months",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

print("✅ SPOPA database initialized successfully!");
EOF
print_success "MongoDB init script created"

# Create basic nginx configuration
print_step "Creating basic nginx configuration..."
cat > nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    upstream frontend {
        server fe_server:3001;
        keepalive 32;
    }

    upstream api_gateway {
        server api_gateway:8080;
        keepalive 32;
    }

    server {
        listen 80;
        server_name localhost;

        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /api/gateway/ {
            proxy_pass http://api_gateway/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/admin/ {
            proxy_pass http://api_gateway/api/admin/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
    }
}
EOF
print_success "Nginx configuration created"

# Create error pages
print_step "Creating error pages..."
cat > nginx/html/50x.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>SPOPA - Service Unavailable</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        h1 { color: #e74c3c; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚧 Service Temporarily Unavailable</h1>
        <p>We're experiencing technical difficulties. Please try again in a few moments.</p>
    </div>
</body>
</html>
EOF

cat > nginx/html/404.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>SPOPA - Page Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        h1 { color: #3498db; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">← Back to Home</a>
    </div>
</body>
</html>
EOF
print_success "Error pages created"

# Create SSL certificates (self-signed for development)
print_step "Creating SSL certificates..."
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=CO/ST=Bogota/L=Bogota/O=SPOPA/CN=localhost" 2>/dev/null || echo "OpenSSL not available, skipping SSL certificates"

# Check if required files exist
print_step "Checking required files..."

if [ ! -d "ss_admin_ms" ]; then
    print_error "ss_admin_ms directory not found!"
    echo "Please ensure your ss_admin_ms service is in the current directory"
    exit 1
fi

if [ ! -d "fe" ]; then
    print_error "fe (frontend) directory not found!"
    echo "Please ensure your frontend service is in the current directory"
    exit 1
fi

if [ ! -f "ss_admin_ms/Dockerfile" ]; then
    print_warning "ss_admin_ms/Dockerfile not found, creating one..."
    cat > ss_admin_ms/Dockerfile << 'EOF'
FROM python:3.10-slim
WORKDIR /app
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chown -R appuser:appuser /app
USER appuser
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:8000/health || exit 1
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
EOF
fi

if [ ! -f "fe/Dockerfile" ]; then
    print_warning "fe/Dockerfile not found, creating one..."
    cat > fe/Dockerfile << 'EOF'
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S frontend -u 1001
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY server.js ./
COPY --from=frontend-builder /app/build ./build
RUN mkdir -p src/config src/api
COPY src/config/ ./src/config/ 2>/dev/null || echo "No config directory"
COPY src/api/ ./src/api/ 2>/dev/null || echo "No api directory"
COPY src/auth_config.json ./src/ 2>/dev/null || echo "No auth config"
RUN chown -R frontend:nodejs /app
USER frontend
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
EXPOSE 3000 3001
CMD ["sh", "-c", "npm start"]
EOF
fi

print_success "Setup completed!"

echo ""
echo -e "${GREEN}🎉 SPOPA System Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start the system: ${YELLOW}docker-compose up -d${NC}"
echo "2. Check status: ${YELLOW}docker-compose ps${NC}"
echo "3. View logs: ${YELLOW}docker-compose logs -f${NC}"
echo "4. Access the app: ${YELLOW}http://localhost${NC}"
echo ""
echo "Useful commands:"
echo "• Stop: ${YELLOW}docker-compose down${NC}"
echo "• Rebuild: ${YELLOW}docker-compose up --build${NC}"
echo "• Scale services: ${YELLOW}docker-compose up --scale ss_admin_ms=3${NC}"
echo ""
echo -e "${BLUE}For advanced load balancing, use the load-balanced configuration files provided.${NC}"