#!/bin/env bash

cd cognito
COGNITO_OUTPUT=$(./dev.sh)
echo "$COGNITO_OUTPUT"
COGNITO_CONTAINER=$(echo "$COGNITO_OUTPUT" | grep Container | cut -d' ' -f2)
COGNITO_CLIENT_ID=$(echo "$COGNITO_OUTPUT" | grep ClientId | cut -d' ' -f2)
cd ..

cd database
DATABASE_CONTAINER=$(./dev.sh)
cd ..

cd backend
DATABASE_URL="postgresql://postgres:1234@localhost:8004/postgres" deno task dev &
PID_BACKEND="$!"
cd ..

cd frontend
VITE_COGNITO_CLIENT_ID="$COGNITO_CLIENT_ID" deno task dev &
PID_FRONTEND="$!"
cd ..

cleanup() {
  echo "Cleaning up..."
  pkill -P $PID_FRONTEND
  pkill -P $PID_BACKEND
  docker stop $DATABASE_CONTAINER
  docker stop $COGNITO_CONTAINER
  exit 0
}

trap cleanup SIGINT
wait $PID_FRONTEND
wait $PID_BACKEND
