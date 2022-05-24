FROM cimg/node:16.15

USER root

ENV YARN_VERSION 1.22.5

RUN mkdir ~/.gnupg
RUN echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf
RUN npm install -g yarn

RUN sudo apt-get update
RUN sudo apt-get install python3-pip python-dev jq
RUN sudo pip install awscli
RUN sudo pip install aws-sam-cli

RUN yarn global add serverless@3.18.1

ADD assume_aws_role.sh /usr/local/bin/assume_aws_role
RUN chmod +x /usr/local/bin/assume_aws_role

USER circleci
