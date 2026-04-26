# Use this image as the platform to build the app
FROM node:24.15.0-trixie@sha256:135dc9a66aef366e09958c18dab705081d77fb31eccffe8c3865fac9d3e42a1d AS build

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

FROM node:24.15.0-trixie@sha256:135dc9a66aef366e09958c18dab705081d77fb31eccffe8c3865fac9d3e42a1d

WORKDIR /app

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/local.db /app/local.db
COPY --from=build /app/drizzle /app/drizzle

RUN npm install --omit=dev --legacy-peer-deps

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node", "build/index.js"]
