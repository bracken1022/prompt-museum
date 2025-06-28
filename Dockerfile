# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package.json backend/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy backend source code
COPY backend/ ./

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]