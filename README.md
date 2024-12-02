# Chain.io Docker Images

Public Docker Images to support Chain.io

[DockerHub](https://hub.docker.com/r/chainio)

## Images

### chainio/lambda-ci-nodejs22.11:

Intended to be used by CI for services running on AWS Lambda

- Node 22.11
- Yarn 1.22.22
- AWS CLI
- [OSS Serverless Framework](https://github.com/oss-serverless/serverless) 3.43 for Deployment purposes

### chainio/lambda-ci-nodejs20.9:

Intended to be used by CI for services running on AWS Lambda

- Node 20.9
- Current / Stable version of Yarn
- AWS CLI
- [Serverless Framework](https://serverless.com/) 3.38 for Deployment purposes

### chainio/lambda-ci-nodejs18.16:

Intended to be used by CI for services running on AWS Lambda

- Node 18.16
- Current / Stable version of Yarn
- AWS CLI
- [Serverless Framework](https://serverless.com/) 3.33 for Deployment purposes

### chainio/lambda-ci-nodejs16.15:

Intended to be used by CI for services running on AWS Lambda

- Node 16.15
- Current / Stable version of Yarn
- AWS CLI
- [Serverless Framework](https://serverless.com/) 3.18 for Deployment purposes

### chainio/lambda-ci-nodejs14.16:

Intended to be used by CI for services running on AWS Lambda

- Node 14.16
- Current / Stable version of Yarn
- AWS CLI
- [Serverless Framework](https://serverless.com/) for Deployment purposes

### chainio/lambda-ci-nodejs12.18:

Intended to be used by CI for services running on AWS Lambda

- Node 12.18.2
- Current / Stable version of Yarn
- AWS CLI
- [Serverless Framework](https://serverless.com/) for Deployment purposes

### chainio/lambda-ci-nodejs10.16:

Intended to be used by CI for services running on AWS Lambda

- Node 10.16
- Current / Stable version of Yarn
- AWS CLI
- [Serverless Framework](https://serverless.com/) for Deployment purposes


### chainio/lambda-ci-nodejs8.10:

Intended to be used by CI for services running on AWS Lambda

- Node 8.10.0
- Current / Stable version of Yarn
- AWS CLI
- [Serverless Framework](https://serverless.com/) for Deployment purposes

#### Assuming AWS roels:

This image contains a script for assuming AWS Roles

It can be called like `source assume_aws_role`

The following environment variables must be set for it to work

- CHAINIO_ENV (environment to deploy to)
- MASTER_AWS_KEY_ID (AWS_ACCESS_KEY_ID for master account)
- MASTER_AWS_SECRET (AWS_SECRET_ACCESS_KEY for master account)
- <environment>_role_arn (Role ARN to assume.  IE "dev_role_arn")

It will automatically set AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, and AWS_SESSION_TOKEN with the requested temporary credentials for the apprpriate environment

### chainio/lambda-ci-nodejs6.10:

Same as above but for Node v6.10.3

### chainio/sphinx-docs

Intended for Continuous Deployment of sphinx based websites to AWS

Contains Python 2, AWS CLI and [Sphinx](http://www.sphinx-doc.org/en/stable/)

## Making changes

To test locally, change to directory with Dockerfile and run `docker build . -t nodejs<version>`

Example: `cd lambda/nodejs22.10 && docker build . -t nodejs22.10`

You must manually use docker login & push to push to dockerhub.

You start the container with a terminal by running `docker run -i -t <container name> /bin/bash`


# Deployment

Login as `chainioadmin`:

`docker login -u chainioadmin`

You can find the credentials in lastpass if it is shared with you.

First build the image via docker build.  Because of the differences in platforms between different
Mac processors, use the platform flags to ensure the platforms are consistent.

`docker buildx build --platform linux/amd64 lambda/nodejs20.9 -t chainio/lambda-ci-nodejs20.9-amd64`

Then push the image to docker hub:

`docker push chainio/lambda-ci-nodejs20.9`

For the arm version:
`docker buildx build --platform linux/arm64 lambda/nodejs20.9 -t chainio/lambda-ci-nodejs20.9-arm64`

Then push the image to docker hub:
`docker push chainio/lambda-ci-nodejs20.9-arm64`
