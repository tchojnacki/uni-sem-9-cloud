#!/bin/env bash

cd cognito
COGNITO_OUTPUT=$(./dev.sh)
echo "$COGNITO_OUTPUT"
COGNITO_CONTAINER=$(echo "$COGNITO_OUTPUT" | grep Container | cut -d' ' -f2)
COGNITO_CLIENT_ID=$(echo "$COGNITO_OUTPUT" | grep ClientId | cut -d' ' -f2)
cd ..

cd backend
deno task dev &
PID_BACKEND="$!"
cd ..

cd frontend
VITE_COGNITO_CLIENT_ID="$COGNITO_CLIENT_ID" deno task dev &
PID_FRONTEND="$!"
cd ..

cleanup() {
  echo "Cleaning up..."
  docker stop $COGNITO_CONTAINER
  pkill -P $PID_BACKEND
  pkill -P $PID_FRONTEND
  exit 0
}

trap cleanup SIGINT
wait $PID_BACKEND
wait $PID_FRONTEND
