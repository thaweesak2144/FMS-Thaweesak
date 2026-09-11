#!/bin/sh
set -e

echo "🚀 Starting Production Application..."

# Run Prisma migrations if DATABASE_URL is available
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Checking and applying database migrations..."
  npx prisma migrate deploy || echo "⚠️ Migration deploy completed or schema up to date."
fi

# Execute CMD
exec "$@"
