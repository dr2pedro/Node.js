ARG src 

FROM node:lts-alpine3.9 AS base
WORKDIR /app
COPY server/configs/auth.json package.json package-lock.json .env ./
RUN apk --no-cache add curl

FROM base AS signin 
COPY server/src/signIn ./

FROM base AS signup
COPY server/src/signUp ./

FROM ${src} AS after

FROM after
RUN npm install
ENTRYPOINT ["npm", "run", "dev"]
