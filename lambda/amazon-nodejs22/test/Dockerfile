FROM public.ecr.aws/lambda/nodejs:22

# Tar is needed by the CircleCI build to pull build artifacts into the container
RUN microdnf install -y tar gzip \
  && npm install -g yarn@1

WORKDIR /home

ENTRYPOINT [ "uname", "-a"]
