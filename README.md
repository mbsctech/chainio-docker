# Chain.io Docker Images

Public Docker Images to support Chain.io

[DockerHub](https://hub.docker.com/r/chainio)

## Images

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

To test locally use `docker build <Dockerfile path>`

Example: `docker build lambda/nodejs6.10`

All changes on `master` branch will be auto-deployed to Docker Hub and tagged with `latest`

You start the container with a terminal by running `docker run -i -t <container name> /bin/bash`
