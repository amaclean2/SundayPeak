FROM node:14

WORKDIR /usr/src/app/client

RUN npm i -g react-scripts

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE 3000