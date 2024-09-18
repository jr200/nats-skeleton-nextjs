#!/bin/sh

[ -f /vault/secrets/environment ] && source /vault/secrets/environment
[ -f /app/.env ] && source /app/.env

node server.js $@
