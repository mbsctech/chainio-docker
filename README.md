# Chain.io Docker Images

Public Docker Images to support Chain.io

[DockerHub](https://hub.docker.com/r/chainio)

## Images

### chainio/amazon-nodejs22
Introduces a new set of images built from Amazon's public image set:

- chainio/amazon-nodejs22-arm64
- chainio/amazon-nodejs22-amd64
- chainio/amazon-nodejs22-test-arm64
- chainio/amazon-nodejs22-test-amd64

The primary image is built from the Amazon Linux image and is meant to be used by the CI/CD pipeline
to build and deploy the project.

The test image is built from the public Amazon Lambda image and is solely meant to be used by the CI/CD pipeline
to run unit test for the project.  By using the offical lambda runtime, we can better ensure compatibility
between the test workspaces and the actual deployment platform.

Includes:
- Node 22.11
- Yarn 1.22.22
- AWS CLI
- [OSS Serverless Framework](https://github.com/oss-serverless/serverless) 3.43 for Deployment purposes

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

#### Assuming AWS roles:

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

Typically, when createing an new image, the easiest way to do so is to copy the previous version
to a new directory and then modify the Dockerfile(s) to update the software versions of nodejs or
yarn, etc.

For the new Amazon Linux based build image, you will likely only have to adjust the nodesource URL to
target a new nodejs version (setup_22.x, setup_23.x, etc).

For the new Amazon Lambda based test image, you should only ever have to change the source image:
public.ecr.aws/lambda/nodejs:22, public.ecr.aws/lambda/nodejs:24, etc.

To test your builds locally, change directory to the same directory that has the Dockerfile in it
and you can build the image with the following command (substitute <tag> for a local name to call the build):
`docker build -t <tag> .`

If your build completes, you can run it locally with: `docker run --rm <tag>`.
If you need to debug and open a shell in the container, try: `docker run --rm -it <tag> sh`

# Deployment

As long as your build sticks to the standard placement of Dockerfiles and directory names
as previous builds (build/test folders for amazon builds or Dockerfile in main folder for legacy build) ,
then the easiest way to cut an official image is to simply run `yarn build --buildDir lambda/<your_build_dir>`.

This will create all the necessary images for the platforms we build for and images for the individual
build and test use cases.

See the command output for the names of the images that were built.

When you are ready to push the images to Docker Hub, you must login as the `chainioadmin` account:

`docker login -u chainioadmin`

You can find the credentials in lastpass if it is shared with you.

If you built the images with the `yarn build` then all you need to do to push them is to execute
the `push` command using the build directory you intend to push as the buildDir parameter:

`yarn push --buildDir lambda/<your_build_dir>`

If you did not use the `yarn build` command, you will need to push the images you build manually.
Don't do this unless you absolutely need to and you absolutely understand what you're doing.
