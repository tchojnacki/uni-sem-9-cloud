#!/bin/env bash

PORT="8002"

echo "Frontend running on http://0.0.0.0:$PORT"
busybox httpd -f -p "$PORT" -h ./dist
