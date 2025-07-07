FROM owasp/modsecurity-crs:nginx

COPY nginx.conf /etc/nginx/nginx.conf
FROM owasp/modsecurity-crs:nginx

# Environment variables to configure the WAF
ENV BACKEND=http://api-gateway:3010
ENV SERVER_NAME=localhost
ENV PORT=8080
ENV PARANOIA=1
ENV ANOMALY_INBOUND=5
ENV ANOMALY_OUTBOUND=4
ENV BLOCKING_PARANOIA=1

# custom ModSecurity rules
# COPY custom-rules.conf /etc/modsecurity.d/custom-rules.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1