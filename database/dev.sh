#!/bin/env bash
PORT="8004"
docker run -d -p "$PORT:5432" -e POSTGRES_PASSWORD="1234" postgres:17.0
