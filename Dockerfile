# STAGE 1: Development
# This stage installs all dependencies (including devDependencies) and copies the source code.
# It's used as a base for the 'builder' stage and for the development environment via docker-compose.
FROM node:18-alpine AS development
WORKDIR /app

# Copy project files and install dependencies
COPY package*.json ./
RUN npm install
COPY . .

# STAGE 2: Builder
# This stage builds the Eleventy site for production.
FROM development AS builder
# The output will be in the default `_site` directory
RUN npx @11ty/eleventy

# STAGE 3: Production
# This stage creates a lean, production-ready image.
FROM node:18-alpine AS production
WORKDIR /app

# Copy server dependencies from the builder stage
COPY --from=builder /app/package*.json ./

# Install only production dependencies for the server
RUN npm install --omit=dev

# Copy the server, the built Eleventy site, and the data file for the view counter.
# Note: The paths here are relative to the WORKDIR inside the 'builder' stage (/app).
COPY --from=builder /app/src/server.js .
COPY --from=builder /app/_site ./_site
# The server expects the _data directory in /app/_data, and your config places it in src/_data.
COPY --from=builder /app/src/_data ./_data

# Expose the port the server runs on
EXPOSE 3000

# The command to start the server
CMD [ "node", "server.js" ]
