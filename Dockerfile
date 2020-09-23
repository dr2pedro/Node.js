ARG src

FROM node:lts-alpine3.9 AS base
WORKDIR /app
COPY server/configs/auth.json package.json package-lock.json .env ./
RUN apk --no-cache add curl

FROM base AS signin 
COPY server/src/signIn ./
HEALTHCHECK CMD curl -fs http://localhost:2221/ || exit 1

FROM base AS signup
COPY server/src/signUp ./
HEALTHCHECK CMD curl -fs http://localhost:2222/ || exit 1

FROM base AS gateway
COPY server/gateway ./
HEALTHCHECK CMD curl -fs http://localhost:2000/ || exit 1

FROM ${src} AS after

FROM after
RUN npm install
ENTRYPOINT ["npm", "run", "dev"]
