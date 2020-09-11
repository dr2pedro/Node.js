FROM node:latest 
WORKDIR /app
COPY package.json package-lock.json .env ./
COPY server/src/signIn server/config ./
RUN npm install
ENTRYPOINT ["npm", "run", "dev"]
