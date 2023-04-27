FROM node:18

WORKDIR /home/app
COPY . /home/app/
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install

USER node

CMD npm start
EXPOSE 5000