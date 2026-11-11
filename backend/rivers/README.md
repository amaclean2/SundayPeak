# Rivers: API Layer for SundayPeak

This is one of the two entry points for the SundayPeak backend service
Rivers collects data, sends it to Water to process and be handled before sending it back to the client.
This layer is seperated from Water because both `Rivers` and `Couloirs` talks to the service layer and needs data for different purposes

### Things to note

- Routes are handles in the `Routes` directory
- They are processed by the methods in `Hanlders`
- `Handlers` mostly just makes sure the data is formatted in a way that `Water` can handle it and then sends it to the service for processing
- It takes the data returned from the service and returns it back to the client in a response structure

### TODO

- I really want to make all of these layers TypeScript so that I'm not constantly going back and forth looking up what the parameters for some method is
- A little bit of organization couldn't hurt
- Mostly I'm pretty happy with how this layer is organized right now

### When Saving Changes

1. Push to Github
2. Push to Dockerhub from `rivers`

```shell
docker build --platform linux/amd64 -t amacleanjs/sunday-service .
docker push amacleanjs/sunday-service
```

### Deployment

Make sure the Dockerfile has the correct command to run the service in production

```shell
docker run -dp 80:5000 amacleanjs/sunday-service
```

### Run locally

if the repo exists locally

```shell
docker run --name rivers -p 80:5000 -v /Users/andrewmaclean/BackyardFriends/rivers/:/home/app rivers
```

otherwise need to set up another container with mysql first. If you do this all data will be removed. Make sure this is what you want.

```shell
docker run -dp 80:5000 amacleanjs/sunday-service
```
