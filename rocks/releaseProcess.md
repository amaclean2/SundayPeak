# Sunday Peak Release Process

## Table of Contents

- [Steps Before Deployment](#steps-before-deployment)
- [Deployment](#deployment)
  - [Rivers Deployment](#rivers-deployment)
    - [Breakdown](#breakdown)
  - [Couloirs Deployment](#couloirs-deployment)
  - [Mountains Deployment](#mountains-deployment)

## Steps Before Deployment

1. Run cypress e2e tests and make sure a whole flow passes
2. Sanity check all the test cases in the `e2eTesting.md` document again the `docker compose` environment to make sure everything roughly behaves.
3. Push everything to github on branch `release-<VERSION NUMBER>`
4. Start a github release
   \_This should automatically start the next few steps of deploying to the server with github actions, but right now I'm still doing it manually to make sure everything goes smoothly

## Deployment

Make sure `release<VERSION NUMBER>` is checked out locally and then start with rivers and couloirs

### Rivers Deployment

1. `cd` into `/rivers` and build the new docker image from the current directory

```shell
docker build --platform linux/amd64 -t amacleanjs/sunday-service:<VERSION NUMBER> -t amaclean/sunday-service:latest --secret id=npmrc,src=$HOME/.npmrc .
```

2. Push the code to docker hub using the following command. The version number can be found in `/rivers/package.json`

```shell
docker image push -a amacleanjs/sunday-service
```

2. You can check on docker hub to verify the new image tag was pushed
3. SSH into the Digital Ocean droplet

```shell
  ssh root@128.199.3.44
```

4. Zip the volume attached to the mysql instance and make a copy on your local machine

```shell
 cd /home/
 tar -czf data.tar.gz data
 # exit out of the server
 scp root@128.199.3.44:/home/data.tar.gz ~/Downloads
```

5. Stop and remove the current running container

```shell
docker stop rivers && docker rm rivers
```

6. Remove the current image

```shell
docker image rm sunday-service
```

7. Pull the new image and check the version

```shell
docker image pull amacleanjs/sunday-service:latest && docker images
```

8. Run the new image

```shell
docker run \
--name rivers \
-d -p 80:5000 \
--network sundaypeak \
-e DB_HOST=mysql \
-e DB_USER=byf \
-e DB_PASS=backyard \
-e DB_NAME=friends \
-e MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYW1hY2xlYW4iLCJhIjoiY2wydzM2YjB2MGh4dzNqb2FpeTg2bmo4dSJ9.KSDbOciqbYDn5eA4SHNOZg \
-e NODEMAILER_APP_PASSWORD=vtmrorarxqkhfcjc \
-e JWT_SECRET=jB2MGh4dzN \
amacleanjs/sunday-service:latest
docker ps -a # verify all containers are running
```

#### Breakdown

- `docker stop rivers` shuts down the current container: rivers
- `docker rm rivers` removes the rivers container
- `docker image rm sunday-service` removes the sunday-service image that rivers is based off
- _can run `docker image ls` to verify the image was removed_
- `docker image pull amacleanjs/sunday-service:latest` pulls the new version of that image from docker hub
- `docker images` verifies that image was infact pulled
- `docker network ls & docker network inspect sundaypeak` checks to see if the `sundaypeak` networks exists and what containers are on it
- `docker run --name rivers -d -p 80:5000 --network sundaypeak amacleanjs/sunday-service:latest` starts the new container with the latest image
  - `--name` gives the container a name
  - `-d` starts the container in detached mode
  - `-p XXXX:XXXX` specifies the port to expose _this is only relevant for external connections, not other containers_
  - `--network` connects this container to a network
  - `XXXX/XXXX:XX` specifies the image to deploy to the container
  - `-e` environment variables
- `docker ps -a` shows a list of the active containers

6. Ensure the new container is running by visiting http://api.sundaypeak.com/services/initial

- This should return a json object
- TODO: create a test endpoint that shows stats data about the app

7. Increment the version number in `/rivers/package.json`

### Couloirs Deployment

1. 1. `cd` into `/couloirs` and build the new docker image from the current directory

```shell
docker build --platform linux/amd64 -t amacleanjs/sunday-communion:<VERSION NUMBER> -t amaclean/sunday-communion:latest --secret id=npmrc,src=$HOME/.npmrc .
```

1. Push the code to docker hub using the following command. The version number can be found in `/couloirs/package.json`

```shell
docker image push -a amacleanjs/sunday-communion
```

2. You can check on docker hub to verify the new image tag was pushed
3. SSH into the Digital Ocean droplet

```shell
  ssh root@128.199.3.44
```

4. Zip the volume attached to the mysql instance and make a copy on your local machine

```shell
 cd /home/
 tar -czf data.tar.gz data
 # exit out of the server
 scp root@128.199.3.44:/home/data.tar.gz ~/Downloads
```

5. Pull and restart the `sunday-communion` container

```shell
docker stop couloirs
docker rm couloirs
docker image rm sunday-communion
docker image pull amacleanjs/sunday-communion:latest
docker images # verify the image is there
docker network ls # verify the sundaypeak network is still there and connected to `mysql`
docker run \
--name couloirs \
-d -p 4000:4000 \
--network sundaypeak \
-e DB_HOST=mysql \
-e DB_USER=byf \
-e DB_PASS=backyard \
-e DB_NAME=friends \
-e JWT_SECRET=jB2MGh4dzN \
-e FILE_STORAGE_PATH=/home/app/public/images \
amacleanjs/sunday-communion:latest
docker ps -a # verify all containers are running
```

6. Increment the version number in `/couloirs/package.json`

### Mountains Deployment

1. Build the react app.

```shell
npm run build
```

1. Build a new image with the current code.

```shell
docker build --platform linux/amd64 -t amacleanjs/sunday-brunch:<VERSION_NUMBER> -t amacleanjs/sunday-brunch:latest . --target=prod
```

2. Push the code to docker hub using the following command. The version number can be found in `/mountains/package.json`

```shell
docker image push -a amacleanjs/sunday-brunch
```

2. You can check on docker hub to verify the new image tag was pushed
3. SSH into the Digital Ocean droplet

```shell
  ssh root@24.199.124.234
```

4. Stop and remove the current mountains container and image

```shell
docker stop mountains && docker rm mountains && docker image rm amacleanjs/sunday-brunch
```

5. Pull the new image from docker hub and ensure it's loaded

```shell
docker image pull amacleanjs/sunday-brunch:latest && docker images
```

6. Run the new image

```shell
docker run \
--name mountains \
-d -p 80:3000 \
-e NODE_ENV=production \
-e REACT_APP_API_URL=http://api.sundaypeak.com \
-e REACT_APP_WEBSOCKET_URL=ws://api.sundaypeak.com:4000 \
amacleanjs/sunday-brunch:latest
```
