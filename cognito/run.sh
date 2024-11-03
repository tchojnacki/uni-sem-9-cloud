#!/bin/env bash
PORT="8003"
docker run -p "$PORT:$PORT" -e PORT="$PORT" -v ./.cognito:/app/.cognito jagregory/cognito-local:3-latest
