# Use Amazon Linux for our deployment/build images
# New image tags are released every two years..2023, 2025, 2027, etc
FROM public.ecr.aws/amazonlinux/amazonlinux:2023

# Add correct node version to dnf repo list
# See https://github.com/nodesource/distributions for supported versions (use rpm)
RUN curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -

# jq and findutils (xargs) are used in the assume_aws_role.sh copied
# into the build below
RUN dnf install -y unzip python3-pip nodejs jq findutils gzip tar git make gcc-c++ \
    && dnf clean all \
    && npm install -g yarn@1 \
    # Use osls fork instead of serverless due to serverless v4 issues
    && yarn global add osls@3.43.0

# Install AWS CLI based on architecture selected
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "amd64" ]; then \
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"; \
    else \
        curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"; \
    fi \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws

# Install AWS SAM CLI
RUN pip3 install aws-sam-cli

# Move our assume role script to folder in the shell's $PATH
COPY --chmod=755 assume_aws_role.sh /usr/local/bin/assume_aws_role

# Create a blank working directory for the app / build to default to running in
WORKDIR /app

# Verify node installation as default command - use the docker run cmd arg to specify
# your actual command to run when using this image
CMD ["node", "--version"]
