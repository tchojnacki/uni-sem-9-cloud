#!/bin/env bash

PORT="8002"

echo "Frontend is running on port $PORT!"
busybox httpd -f -p "$PORT" -h ./dist
