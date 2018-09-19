FROM node:8-alpine

WORKDIR /srv/app

COPY package*.json ./

RUN npm install

COPY . .

# EXPOSE 3000
# CMD ["npm", "start"]