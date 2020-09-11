FROM node:latest 
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/src/signIn server/config ./
RUN npm install
