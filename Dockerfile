# Use this image as the platform to build the app
FROM node:24-trixie@sha256:dcc3e56b82427ddc3b91ca2b18499450d670fc58251d944e5107d8ef2899f841 AS build

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app

# Install packages
RUN yarn global add pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm drizzle-kit generate && \
  pnpm drizzle-kit push && \
  pnpm build

FROM node:24-trixie@sha256:dcc3e56b82427ddc3b91ca2b18499450d670fc58251d944e5107d8ef2899f841

WORKDIR /app

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/local.db /app/local.db
COPY --from=build /app/drizzle /app/drizzle

RUN npm install --omit=dev --legacy-peer-deps

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node", "build/index.js"]
