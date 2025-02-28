FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install global dependencies
RUN npm install -g concurrently

# Install project dependencies
RUN npm install

# Copy entire project
COPY . .

# Install dev dependencies
RUN npm install -D tailwindcss postcss autoprefixer

# Create Tailwind config if not exists
RUN if [ ! -f tailwind.config.js ]; then \
    npx tailwindcss init -p; \
    fi

# Build the application
RUN npm run build

# Expose ports
EXPOSE 5000 5173

# Default command
CMD ["npm", "run", "dev"]