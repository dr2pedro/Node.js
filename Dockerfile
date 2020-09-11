FROM node:latest 
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/gateway .
RUN npm install
ENTRYPOINT ["npm", "run", "dev_gateway"]
