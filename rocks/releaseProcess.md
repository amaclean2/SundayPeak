# Sunday Peak Release Process

## Steps Before Deployment

1. Run cypress e2e tests and make sure a whole flow passes
2. Sanity check all the test cases in the `e2eTesting.md` document again the `docker compose` environment to make sure everything roughly behaves.
3. Push everything to github on branch `release-<VERSION NUMBER>`
4. Start a github release
   \_This should automatically start the next few steps of deploying to the server with github actions, but right now I'm still doing it manually to make sure everything goes smoothly

## Deployment

Make sure `release<VERSION NUMBER>` is checked out locally and then start with rivers and couloirs

### Rivers Deployment

1. Push the code to docker hub using the following command

```shell
docker build --platform linux/amd64 -t amacleanjs/sunday-service:<VERSION NUMBER> -t amaclean/sunday-service:latest .
docker image push -a amacleanjs/sunday-service
```

2. You can check on docker hub to verify the new image tag was pushed
3. SSH into the Digital Ocean droplet

```shell
  ssh root@128.199.3.44
```

4. Zip the volume attached to the mysql instance and make a copy on your local machine

```shell
# To be defined
```

5. Pull and restart the `sunday-service` container

```shell
docker stop rivers
docker rm rivers
docker image rm sunday-service
docker image pull amacleanjs/sunday-service:latest
docker images # verify the image is there
docker network ls # verify the sundaypeak network is still there and connected to `mysql`
docker run \
--name rivers \
-d -p 80:5000 \
--network sundaypeak \
-e DB_HOST=mysql
-e DB_USER=byf
-e DB_PASS=backyard
-e DB_NAME=friends
-e MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYW1hY2xlYW4iLCJhIjoiY2wydzM2YjB2MGh4dzNqb2FpeTg2bmo4dSJ9.KSDbOciqbYDn5eA4SHNOZg
-e NODEMAILER_APP_PASSWORD=vtmrorarxqkhfcjc
-e JWT_SECRET=jB2MGh4dzN
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
