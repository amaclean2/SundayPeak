FROM node:18-alpine as base
WORKDIR /home/app
COPY . /home/app/
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install
COPY . /home/app/

FROM base as test
ENV NODE_ENV test
RUN npm run test:once

FROM node:18-alpine as prod
WORKDIR /home/prod
COPY ./build /home/prod/build
EXPOSE 3000
USER node
CMD npx serve -s build