FROM node:18-alpine

WORKDIR /home/app
COPY . /home/app/
RUN npm install

USER node

CMD npm start
EXPOSE 4000