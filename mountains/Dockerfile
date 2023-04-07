FROM node:18-alpine as base

WORKDIR /home/app
COPY ./package.json /home/app/
RUN npm install

FROM base as test
COPY . /home/app
ENV NODE_ENV test
RUN npm run test:once

FROM base as prod
COPY . /home/app
RUN npm run build
ENV NODE_ENV production
EXPOSE 3000
USER node
CMD ["npx", "serve", "build"]