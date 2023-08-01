FROM cimg/node:16.20

USER root

RUN mkdir ~/.gnupg
RUN echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf

RUN sudo apt-get update

RUN yarn global add serverless@3.33.0

RUN sudo apt-get install python3-pip
RUN sudo pip install awscli
RUN sudo pip install aws-sam-cli


ADD assume_aws_role.sh /usr/local/bin/assume_aws_role
RUN chmod +x /usr/local/bin/assume_aws_role

USER circleci
