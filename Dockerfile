# STAGE 1: Build the Eleventy site
FROM node:18-alpine AS builder
WORKDIR /app

# Copy project files and install dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Build the Eleventy site
# The output will be in the default `_site` directory
RUN npx @11ty/eleventy

# STAGE 2: Setup the production server
FROM node:18-alpine
WORKDIR /app

# Copy server dependencies from the builder stage
COPY --from=builder /app/package*.json ./

# Install only production dependencies for the server
RUN npm install --omit=dev

# Copy the server file and the built Eleventy site
COPY --from=builder /app/server.js .
COPY --from=builder /app/_site ./_site
COPY --from=builder /app/data ./data

# Expose the port the server runs on
EXPOSE 8080

# The command to start the server
CMD [ "npm", "start" ]
