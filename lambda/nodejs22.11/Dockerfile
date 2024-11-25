FROM cimg/node:22.11

USER root

RUN mkdir ~/.gnupg &&\
    echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf &&\
    yarn global add osls@3.43.0 &&\
    sudo apt-get update &&\
    sudo apt-get install python3-pip &&\
    sudo pip install awscli aws-sam-cli

COPY --chmod=755 assume_aws_role.sh /usr/local/bin/assume_aws_role

USER circleci
