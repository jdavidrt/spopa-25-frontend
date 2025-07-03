# Multi-stage build for React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files for React app
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy React source code
COPY public/ ./public/
COPY src/ ./src/

# Build React app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S frontend -u 1001

# Install server dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy server files
COPY server.js ./
COPY api-server.js ./
COPY api-session-server.js ./

# Copy React build from builder stage
COPY --from=frontend-builder /app/build ./build

# Create required directories and files
RUN mkdir -p src/config src/api


# Change ownership
RUN chown -R frontend:nodejs /app
USER frontend

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose ports
EXPOSE 3000 3001

# Start script
CMD ["sh", "-c", "npm start"]