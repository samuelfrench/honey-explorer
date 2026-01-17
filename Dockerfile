# Stage 1: Build backend with Maven
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build

WORKDIR /app

# Copy pom.xml and download dependencies (cache layer)
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Build frontend with Node
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy package files and install dependencies (cache layer)
COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source and build
COPY frontend/ ./
RUN npm run build

# Stage 3: Runtime with Java 21 JRE + Nginx
FROM eclipse-temurin:21-jre-alpine

# Install nginx
RUN apk add --no-cache nginx

# Create necessary directories
RUN mkdir -p /var/log/nginx /var/lib/nginx/tmp /run/nginx && \
    chown -R nginx:nginx /var/log/nginx /var/lib/nginx /run/nginx

# Copy backend JAR
COPY --from=backend-build /app/target/*.jar /app/app.jar

# Copy frontend build
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy nginx configurations
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Setup nginx main config
RUN echo "user nginx;" > /etc/nginx/nginx.conf && \
    echo "worker_processes auto;" >> /etc/nginx/nginx.conf && \
    echo "error_log /var/log/nginx/error.log warn;" >> /etc/nginx/nginx.conf && \
    echo "pid /run/nginx/nginx.pid;" >> /etc/nginx/nginx.conf && \
    echo "" >> /etc/nginx/nginx.conf && \
    echo "events {" >> /etc/nginx/nginx.conf && \
    echo "    worker_connections 1024;" >> /etc/nginx/nginx.conf && \
    echo "}" >> /etc/nginx/nginx.conf && \
    echo "" >> /etc/nginx/nginx.conf && \
    echo "http {" >> /etc/nginx/nginx.conf && \
    echo "    include /etc/nginx/mime.types;" >> /etc/nginx/nginx.conf && \
    echo "    default_type application/octet-stream;" >> /etc/nginx/nginx.conf && \
    echo "" >> /etc/nginx/nginx.conf && \
    echo "    log_format main '\$remote_addr - \$remote_user [\$time_local] \"\$request\" '" >> /etc/nginx/nginx.conf && \
    echo "                    '\$status \$body_bytes_sent \"\$http_referer\" '" >> /etc/nginx/nginx.conf && \
    echo "                    '\"\$http_user_agent\" \"\$http_x_forwarded_for\"';" >> /etc/nginx/nginx.conf && \
    echo "" >> /etc/nginx/nginx.conf && \
    echo "    access_log /var/log/nginx/access.log main;" >> /etc/nginx/nginx.conf && \
    echo "" >> /etc/nginx/nginx.conf && \
    echo "    sendfile on;" >> /etc/nginx/nginx.conf && \
    echo "    tcp_nopush on;" >> /etc/nginx/nginx.conf && \
    echo "    keepalive_timeout 65;" >> /etc/nginx/nginx.conf && \
    echo "" >> /etc/nginx/nginx.conf && \
    echo "    include /etc/nginx/conf.d/*.conf;" >> /etc/nginx/nginx.conf && \
    echo "}" >> /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start services
CMD ["/start.sh"]
