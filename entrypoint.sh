#!/bin/sh
set -e

# Load a secret from the file named by <VAR>_FILE when that is set, otherwise keep
# whatever <VAR> already holds. Lets the same image run with Docker secrets or with
# plain environment variables. printenv is used instead of eval so values containing
# spaces, quotes or globs survive intact.
load_secret() {
  _var="$1"
  _file=$(printenv "${_var}_FILE" || true)

  if [ -n "$_file" ]; then
    if [ ! -f "$_file" ]; then
      echo "$_var: ${_var}_FILE points at $_file, which does not exist." >&2
      exit 1
    fi
    export "$_var=$(cat "$_file")"
  fi
}

load_secret CLIENT_ID
load_secret CLIENT_SECRET
load_secret SESH_SECRET
load_secret ALTCHA_HMAC
load_secret UPSTASH_REDIS_URL
load_secret UPSTASH_REDIS_TOKEN

# The app and the migration runner both read DATABASE_URL; nothing else sets it.
export DATABASE_URL="${DATABASE_URL:-/app/data/local.db}"

mkdir -p "$(dirname "$DATABASE_URL")"

echo "Running migrations against $DATABASE_URL..."

# Uses drizzle-orm's migrator rather than `drizzle-kit migrate` so drizzle-kit does
# not have to be installed in the production image. Failing here is fatal on purpose:
# starting the app against an unmigrated schema fails later and less clearly.
if ! node /app/scripts/migrate.js; then
  echo "Migrations failed, refusing to start." >&2
  exit 1
fi

echo "Starting the application..."
exec "$@"
