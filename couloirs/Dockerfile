FROM node:18-alpine

WORKDIR /home/app
COPY ./package.json /home/app/package.json

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install

COPY . /home/app

USER root

CMD npm start
EXPOSE 4000