FROM node:24.19.0-alpine3.23@sha256:244cc2b53f46f9e876304391d17682b0ddae9ac33491f4857e25e35a36ba7995 AS base

#
# INSTALL STAGE
#
FROM base AS prod-deps

# Access PNPM with Corepack. build-base and python3 are needed because better-sqlite3
# has no musl prebuild and compiles from source.
RUN corepack enable && \
  apk add --no-cache build-base python3

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Fetch into the pnpm store and install prod deps from it.
# --prod matters: `pnpm fetch` materialises node_modules/.pnpm straight from the
# lockfile and ignores the manifest, so without it the virtual store keeps every dev
# package. `pnpm install --prod` then only drops the top-level links, and the dev
# packages ride along into the runtime image.
#
# These must stay in a single RUN: the store lives in a BuildKit cache mount whose
# contents are not part of the image layer, so a cached `pnpm fetch` layer can be
# replayed against an empty store.
RUN --mount=type=cache,id=kasterpalu-pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm fetch --prod --frozen-lockfile \
  && pnpm install --frozen-lockfile --prod

#
# BUILD STAGE
#
FROM base AS build

RUN corepack enable && \
  apk add --no-cache build-base python3

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Fetch into the pnpm store and install all deps from it (see note above).
RUN --mount=type=cache,id=kasterpalu-pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm fetch --frozen-lockfile \
  && pnpm install --frozen-lockfile

# Copy only files needed for build (layer caching optimization)
# Config files change less frequently
COPY svelte.config.js vite.config.ts tsconfig.json tailwind.config.ts ./
COPY drizzle.config.ts components.json ./
# Paraglide compiles from these at build time
COPY project.inlang ./project.inlang
COPY messages ./messages

# Source code changes frequently
COPY scripts ./scripts
COPY src ./src
COPY static ./static
COPY drizzle ./drizzle

# SvelteKit imports every server module while analysing routes, so $env/dynamic/private
# is read at build time. The real .env is excluded from the image, so write placeholders
# instead; the real values come from the runtime environment. This stage is discarded, so
# the file never reaches the final image.
RUN printf '%s\n' \
  'ALTCHA_HMAC=build-placeholder' \
  'UPSTASH_REDIS_URL=https://build-placeholder.upstash.io' \
  'UPSTASH_REDIS_TOKEN=build-placeholder' \
  'DATABASE_URL=build-placeholder.db' > .env

RUN --mount=type=cache,id=kasterpalu-pnpm-cache,target=/root/.cache/pnpm \
  NODE_OPTIONS="--max-old-space-size=4096" NODE_ENV=production pnpm run build

#
# PRODUCTION STAGE
#
FROM base

# apk upgrade because the base image is digest-pinned: without it the image keeps
# whatever package versions were current when that digest was built.
# npm is removed because the runtime only runs `node`, and npm's bundled dependencies
# (tar, sigstore, ip-address, ...) are a standing source of CVEs in the scan.
RUN apk upgrade --no-cache && \
  rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx && \
  addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
# Need package.json for "type": "module" — build/index.js and scripts/migrate.js are ESM
COPY --from=build /app/package.json ./package.json
# Generated migration SQL, applied by scripts/migrate.js at startup.
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/scripts/migrate.js ./scripts/migrate.js
COPY entrypoint.sh /app/entrypoint.sh

# /app/data holds the SQLite file and is where the volume mounts.
# Creating it makes volume inherit that node user ownership instead of root.
RUN mkdir -p /app/data && \
  chown -R nodejs:nodejs /app && \
  chmod +x entrypoint.sh

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -q --tries 1 --spider http://127.0.0.1:3000 || exit 1

# Entrypoint with db migration
ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD ["node", "build/index.js"]
