FROM cimg/node:12.18.2

USER root

ENV YARN_VERSION 1.19.1

RUN mkdir ~/.gnupg
RUN echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf
RUN echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf
# RUN npm install -g yarn@1.19.1 # cimg/node:14.18.2 pre-installs yarn at 1.22.4

RUN sudo apt-get update
RUN sudo apt-get install python-pip python-dev jq
RUN sudo pip install awscli

RUN yarn global add serverless@3.22

ADD assume_aws_role.sh /usr/local/bin/assume_aws_role
RUN chmod +x /usr/local/bin/assume_aws_role

USER circleci
