# Use this image as the platform to build the app
FROM node:20 AS build

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app

# Install packages
RUN yarn global add pnpm

COPY package.json .
RUN pnpm i

COPY . .

# Use secrets during build
RUN --mount=type=secret,id=CLIENT_ID \
  --mount=type=secret,id=CLIENT_SECRET \
  --mount=type=secret,id=SESH_SECRET \
  --mount=type=secret,id=ALTCHA_HMAC \
  --mount=type=secret,id=UPSTASH_REDIS_URL \
  --mount=type=secret,id=UPSTASH_REDIS_TOKEN \
  CLIENT_ID="$(cat /run/secrets/CLIENT_ID)" && \
  CLIENT_SECRET="$(cat /run/secrets/CLIENT_SECRET)" && \
  SESH_SECRET="$(cat /run/secrets/SESH_SECRET)" && \
  ALTCHA_HMAC="$(cat /run/secrets/ALTCHA_HMAC)" && \
  UPSTASH_REDIS_URL="$(cat /run/secrets/UPSTASH_REDIS_URL || echo '')" && \
  UPSTASH_REDIS_TOKEN="$(cat /run/secrets/UPSTASH_REDIS_TOKEN || echo '')" && \
  printf "CLIENT_ID=%s\nCLIENT_SECRET=%s\nSESH_SECRET=%s\nALTCHA_HMAC=%s\nUPSTASH_REDIS_URL=%s\nUPSTASH_REDIS_TOKEN=%s" "$CLIENT_ID" "$CLIENT_SECRET" "$SESH_SECRET" "$ALTCHA_HMAC" "$UPSTASH_REDIS_URL" "$UPSTASH_REDIS_TOKEN" > .env

RUN pnpm drizzle-kit generate && \
  pnpm drizzle-kit push && \
  pnpm build

FROM node:20

WORKDIR /app

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/local.db /app/local.db
COPY --from=build /app/drizzle /app/drizzle

RUN npm install --omit=dev --legacy-peer-deps

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node", "build/index.js"]
