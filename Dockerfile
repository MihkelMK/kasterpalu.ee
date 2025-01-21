# Use this image as the platform to build the app
FROM node:20 AS build

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app

# Install packages
RUN yarn global add pnpm

ARG CLIENT_ID
ARG CLIENT_SECRET
ARG SESH_SECRET

RUN printf "CLIENT_ID=%s\nCLIENT_SECRET=%s\nSESH_SECRET=%s\n" "${CLIENT_ID}" "${CLIENT_SECRET}" "${SESH_SECRET}" > .env

COPY package.json .
RUN pnpm i

COPY . .

# Build SvelteKit app
RUN pnpm build

FROM node:20

WORKDIR /app

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json

RUN npm install --omit=dev --legacy-peer-deps

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node", "build/index.js"]
