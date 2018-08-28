unset  AWS_SESSION_TOKEN

role_env_name=${CHAINIO_ENV}_role_arn
temp_role=$(AWS_ACCESS_KEY_ID=$MASTER_AWS_KEY_ID AWS_SECRET_ACCESS_KEY=$MASTER_AWS_SECRET aws sts assume-role \
                    --role-arn "${!role_env_name}" \
                    --role-session-name "circleci" )

export AWS_ACCESS_KEY_ID=$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)
export AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)
export AWS_SESSION_TOKEN=$(echo $temp_role | jq .Credentials.SessionToken | xargs)