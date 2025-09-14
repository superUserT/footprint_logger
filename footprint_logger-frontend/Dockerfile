# ---- Build Stage ----
FROM node:18-slim AS build

WORKDIR /usr/src/app

# Copy dependencies first
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the app into "footprint_logger-application"
RUN npm run build && mv dist build

# ---- Production Stage ----
FROM nginx:alpine

# Copy built assets to nginx html folder
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port
EXPOSE 9000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
