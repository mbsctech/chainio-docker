FROM cimg/node:20.9

USER root

RUN mkdir ~/.gnupg && echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf

RUN sudo apt-get update

RUN yarn global add serverless@3.33.0

RUN sudo apt-get install python3-pip
RUN sudo pip install awscli aws-sam-cli


COPY --chmod=755 assume_aws_role.sh /usr/local/bin/assume_aws_role

USER circleci
