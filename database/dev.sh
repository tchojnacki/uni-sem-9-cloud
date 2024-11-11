#!/bin/env bash
PORT="8004"
docker run -d -p "$PORT:5432" -e POSTGRES_PASSWORD="pass" postgres:17.0-alpine
