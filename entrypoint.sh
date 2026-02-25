#!/bin/sh
# This script is used as the container's entrypoint.
# It ensures that the /app/_data directory (mounted as a volume)
# is owned by the non-root 'node' user, so the application can write to it.

set -e

# Fix ownership of the data volume and execute the main command as the 'node' user
DATA_DIR=${DATA_DIR:-/app/src/_data}
chown -R node:node "$DATA_DIR"
exec su-exec node "$@"
