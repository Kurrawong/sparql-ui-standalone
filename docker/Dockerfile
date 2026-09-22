# Reference example: builds the app as a static site and serves it with nginx.
# See the README for how to reskin the app before building this image.

ARG NODE_VERSION=24-alpine
FROM node:${NODE_VERSION} AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_SPARQL_ENDPOINT
ENV VITE_SPARQL_ENDPOINT=$VITE_SPARQL_ENDPOINT

RUN pnpm build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
