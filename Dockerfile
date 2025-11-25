# Use this image as the platform to build the app
FROM node:20 AS build

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app

# Install packages
RUN yarn global add pnpm

COPY package.json .
RUN pnpm i

COPY . .

# Accept build arguments for SvelteKit $env/static/private
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG SESH_SECRET
ARG ALTCHA_HMAC
ARG UPSTASH_REDIS_URL=""
ARG UPSTASH_REDIS_TOKEN=""

# Set as environment variables for SvelteKit build
ENV CLIENT_ID=${CLIENT_ID}
ENV CLIENT_SECRET=${CLIENT_SECRET}
ENV SESH_SECRET=${SESH_SECRET}
ENV ALTCHA_HMAC=${ALTCHA_HMAC}
ENV UPSTASH_REDIS_URL=${UPSTASH_REDIS_URL}
ENV UPSTASH_REDIS_TOKEN=${UPSTASH_REDIS_TOKEN}

RUN pnpm drizzle-kit generate \
  && pnpm drizzle-kit push \
  && pnpm build

FROM node:20

WORKDIR /app

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/local.db /app/local.db
COPY --from=build /app/drizzle /app/drizzle

RUN npm install --omit=dev --legacy-peer-deps

# Accept build arguments for SvelteKit $env/static/private
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG SESH_SECRET
ARG ALTCHA_HMAC
ARG UPSTASH_REDIS_URL=""
ARG UPSTASH_REDIS_TOKEN=""

# Set as environment variables for SvelteKit build
ENV CLIENT_ID=${CLIENT_ID}
ENV CLIENT_SECRET=${CLIENT_SECRET}
ENV SESH_SECRET=${SESH_SECRET}
ENV ALTCHA_HMAC=${ALTCHA_HMAC}
ENV UPSTASH_REDIS_URL=${UPSTASH_REDIS_URL}
ENV UPSTASH_REDIS_TOKEN=${UPSTASH_REDIS_TOKEN}

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node", "build/index.js"]
