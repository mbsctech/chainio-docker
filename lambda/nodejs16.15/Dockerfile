FROM cimg/node:16.15.1

USER root

ENV YARN_VERSION 1.22.5

# symlink to fix missing node and npm links
RUN sudo ln -s "/home/circleci/.nvm/versions/node/v16.15.1/bin/node" "/usr/local/bin/node" && sudo ln -s "/home/circleci/.nvm/versions/node/v16.15.1/bin/npm" "/usr/local/bin/npm"

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
