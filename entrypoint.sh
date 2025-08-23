#!/bin/sh
# This script is used as the container's entrypoint.
# It ensures that the /app/_data directory (mounted as a volume)
# is owned by the non-root 'appuser', so the application can write to it.

set -e

# Fix ownership of the data volume and execute the main command
chown -R appuser:appgroup /app/_data
exec su-exec appuser "$@"
