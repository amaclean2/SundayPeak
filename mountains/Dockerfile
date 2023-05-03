FROM node:18-alpine as base
WORKDIR /home/app
COPY . /home/app/
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install
COPY . /home/app/

# for not the front-end isn't included in the docker compose so we're not building it with docker
# the lines below are used a reference for now

# FROM node:18-alpine as dev
# WORKDIR /home/dev
# COPY --from=base . /home/dev/
# ENV NODE_ENV development
# EXPOSE 3000
# USER node
# CMD npm run dev


FROM base as test
ENV NODE_ENV test
RUN npm run test:once

FROM node:18-alpine as prod
WORKDIR /home/prod
COPY ./build /home/prod/build
EXPOSE 3000
USER node
CMD npx serve -s build