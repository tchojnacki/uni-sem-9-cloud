#!/bin/env bash
PORT="8003"

CONTAINER=$(docker run -d -p "$PORT:$PORT" -e PORT="$PORT" jagregory/cognito-local:3-latest)
ENDPOINT="http://localhost:$PORT"
USER_POOL_ID=$(aws --endpoint "$ENDPOINT" cognito-idp create-user-pool --pool-name CloudUserPool | jq -r .UserPool.Id)
CLIENT_ID=$(aws --endpoint "$ENDPOINT" cognito-idp create-user-pool-client --user-pool-id "$USER_POOL_ID" --client-name CloudUserPoolClient | jq -r .UserPoolClient.ClientId)
echo -e "Container: $CONTAINER\nUser Pool ID: $USER_POOL_ID\nClient ID: $CLIENT_ID"

create_user() {
  aws --endpoint "$ENDPOINT" cognito-idp sign-up --client-id "$CLIENT_ID" --username "$1" --password "$2" > /dev/null
  aws --endpoint "$ENDPOINT" cognito-idp admin-confirm-sign-up --user-pool-id "$USER_POOL_ID" --username "$1" > /dev/null
  echo "User $1 with password $2 created"
}

create_user "test1" "pass1"
create_user "test2" "pass2"
create_user "test3" "pass3"
