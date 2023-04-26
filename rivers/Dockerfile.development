FROM node:18-alpine

WORKDIR /home/app
COPY . /home/app/
RUN npm install

USER node

CMD npm run dev
EXPOSE 5000