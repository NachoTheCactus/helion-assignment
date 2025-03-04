FROM node:20-alpine

WORKDIR /app

# Install dependencies first to use caching
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Build step
RUN npm run build

EXPOSE 3000

# Simplified CMD
CMD sh -c "npm run seed && npm run start"