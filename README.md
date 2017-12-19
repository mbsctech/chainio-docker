## Chain.io Docker Images

Public Docker Images to support Chain.io

[DockerHub](https://hub.docker.com/r/chainio)

### Images

`chainio/lambda-ci-nodejs6.10`:

Intended to be used by CI for services running on AWS Lambda

Contains Node 6.10.3 and a current / stable version of [Yarn](https://yarnpkg.com/en/)


### Making changes

To test locally use `docker build <Dockerfile path>`

Example: `docker build lambda/nodejs6.10`

All changes on `master` branch will be auto-deployed to Docker Hub and tagged with `latest`

You start the container with a terminal by running `docker run -i -t <container name> /bin/bash`
