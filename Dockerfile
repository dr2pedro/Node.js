ARG src

FROM node:latest AS base
WORKDIR /app
COPY server/configs/auth.json package.json package-lock.json .env ./

FROM base AS signin 
COPY server/src/signIn ./

FROM base AS signup
COPY server/src/signUp ./

FROM base AS gateway
COPY server/gateway ./

FROM ${src} AS after

FROM after
RUN npm install
ENTRYPOINT ["npm", "run", "dev"]
