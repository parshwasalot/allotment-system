# Multi-stage build for optimized production image

# Stage 1: Build Frontend
FROM node:18-alpine as frontend-builder
WORKDIR /allotment-system/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine as backend-builder
WORKDIR /allotment-system/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Stage 3: Production Environment
FROM node:18-alpine
WORKDIR /allotment-system

# Install MongoDB
RUN apk add --no-cache mongodb-tools

# Create directory structure
RUN mkdir -p /allotment-system/frontend/build /allotment-system/backend

# Copy backend from backend-builder
COPY --from=backend-builder /allotment-system/backend /allotment-system/backend

# Copy frontend build from frontend-builder
COPY --from=frontend-builder /allotment-system/frontend/build /allotment-system/frontend/build

# Set working directory to backend
WORKDIR /allotment-system/backend

# Install production dependencies only
RUN npm install --only=production

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV MONGO_URI=mongodb://localhost:27017/seminar_hall_db
ENV JWT_SECRET=12345678

# Expose ports
EXPOSE 5000
EXPOSE 27017

# Create startup script
RUN echo '#!/bin/sh\n\
mongod --fork --logpath /var/log/mongodb.log --bind_ip_all\n\
node server.js' > /app/start.sh

RUN chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]
