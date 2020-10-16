ARG src 

FROM node:lts-alpine3.9 AS base
WORKDIR /app
COPY configs/auth.json package.json package-lock.json .env ./
RUN apk --no-cache add curl

FROM base AS gateway 
COPY server/gateway ./

FROM base AS signin 
COPY server/src/signIn ./

FROM base AS signup
COPY server/src/signUp ./

FROM base AS forgotpassword
COPY server/src/forgotPassword ./

FROM ${src} AS after

FROM after
RUN npm install
ENTRYPOINT ["npm", "run", "start"]
