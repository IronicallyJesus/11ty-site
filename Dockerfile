# Dockerfile optimized for Raspberry Pi (ARM64) and faster builds.

# Docker BuildKit arguments for multi-platform builds.
# These are automatically populated by Docker.
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# STAGE 1: Dependencies
# This stage installs all dependencies (dev and prod) from package-lock.json
# It's used as a base for both development and builder stages to leverage caching.
FROM --platform=${BUILDPLATFORM} node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Use `npm ci` for faster, more reliable builds from package-lock.json
RUN npm ci

# STAGE 2: Development
# This stage is for local development. It includes devDependencies and source code.
# In docker-compose.dev.yml, the source is mounted for hot-reloading.
FROM deps AS development
COPY . .
# The command is specified in docker-compose.dev.yml, but we can add a default.
CMD ["npm", "start"]

# STAGE 3: Builder
# This stage builds the Eleventy site for production.
FROM deps AS builder
COPY . .
# Build the site. Requires a "build": "eleventy" script in package.json
RUN npm run build
# After building, remove development dependencies to keep the final image small.
RUN npm prune --production

# STAGE 4: Production
# This stage creates a lean, production-ready image.
FROM node:18-alpine AS production
WORKDIR /app

# Create a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install su-exec for dropping privileges from root
RUN apk add --no-cache su-exec

# Copy only the necessary artifacts from the builder stage
# Using --chown ensures the non-root user owns the files.
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=builder --chown=appuser:appgroup /app/src/server.js .
COPY --from=builder --chown=appuser:appgroup /app/_site ./_site
# The _data directory is handled by the volume, but we copy it so the volume can be pre-populated on first run.
COPY --from=builder --chown=appuser:appgroup /app/src/_data/ ./_data/
COPY --chown=appuser:appgroup healthcheck.js .

# Copy and set up the entrypoint script
COPY --chown=root:root entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the port the server runs on
EXPOSE 3000

# Add a healthcheck to ensure the container is running correctly.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["su-exec", "appuser", "node", "healthcheck.js"]

ENTRYPOINT ["entrypoint.sh"]
CMD ["node", "server.js"]
