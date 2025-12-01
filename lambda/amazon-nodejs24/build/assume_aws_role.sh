[ -z "$CHAINIO_ENV" ] && echo "Must set CHAINIO_ENV to current environment" && exit 1;
[ -z "$MASTER_AWS_KEY_ID" ] && echo "Must set MASTER_AWS_KEY_ID" && exit 1;
[ -z "$MASTER_AWS_SECRET" ] && echo "Need to set MASTER_AWS_SECRET" && exit 1;

role_env_name=${CHAINIO_ENV}_role_arn

[ -z "${!role_env_name}" ] && echo "Missing environment variable $role_env_name to deploy to $CHAINIO_ENV" && exit 1;

unset AWS_SESSION_TOKEN
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

temp_role=$(AWS_ACCESS_KEY_ID=$MASTER_AWS_KEY_ID AWS_SECRET_ACCESS_KEY=$MASTER_AWS_SECRET aws sts assume-role \
                    --role-arn "${!role_env_name}" \
                    --role-session-name "circleci" )

export AWS_ACCESS_KEY_ID=$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)
export AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)
export AWS_SESSION_TOKEN=$(echo $temp_role | jq .Credentials.SessionToken | xargs)