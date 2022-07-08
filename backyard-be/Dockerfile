FROM node:14

WORKDIR /usr/src/app/server

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE 5000