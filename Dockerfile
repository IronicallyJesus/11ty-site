# Dockerfile with multi-stage for faster and smaller builds.

# STAGE 1: Builder
# This stage builds the Eleventy site for production.
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Use `npm ci` for faster, more reliable builds from package-lock.json
RUN npm ci
COPY . .
# Build the site. Requires a "build": "eleventy" script in package.json
RUN npm run build
# After building, remove development dependencies to keep the final image small.
RUN npm prune --omit=dev

# STAGE 2: Production
# This stage creates a lean, production-ready image.
FROM node:18-alpine AS production
WORKDIR /app
ENV DATA_DIR=/app/src/_data

# The node:18-alpine image comes with a non-root 'node' user (UID/GID 1000)
# which we will use. We only need su-exec to drop privileges in the entrypoint.
# Install su-exec for dropping privileges from root
RUN apk add --no-cache su-exec

# Copy only the necessary artifacts from the builder stage
# Using --chown ensures the non-root user owns the files.
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/server.js .
COPY --from=builder --chown=node:node /app/_site ./_site

# Copy the data directory. The server writes view counts here.
# This directory should be mounted as a volume
# to persist the view count data across container restarts.
COPY --from=builder --chown=node:node /app/src/_data ./src/_data
COPY --chown=node:node healthcheck.js .

# Copy and set up the entrypoint script
COPY --chown=root:root entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Add a healthcheck to ensure the container is running correctly.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["node", "healthcheck.js"]

ENTRYPOINT ["entrypoint.sh"]
CMD ["node", "server.js"]
