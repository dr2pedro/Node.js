ARG src 

FROM node:lts-alpine3.9 AS base
WORKDIR /app
COPY package.json package-lock.json .env ./
RUN apk --no-cache add curl

FROM base AS gateway 
COPY server/gateway ./

FROM base AS signin 
COPY server/src/signIn configs/auth.json ./

FROM base AS signup
COPY server/src/signUp configs/auth.json ./

FROM base AS forgotpassword
COPY server/src/forgotPassword configs/smtp.json configs/viewEngineOptions.json ./
COPY template template

FROM ${src} AS after

FROM after
RUN npm install
ENTRYPOINT ["npm", "run", "start"]
