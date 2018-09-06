FROM python:2

RUN pip install --no-cache-dir sphinx
RUN pip install --no-cache-dir awscli

ADD assume_aws_role.sh /usr/local/bin/assume_aws_role
RUN chmod +x /usr/local/bin/assume_aws_role
