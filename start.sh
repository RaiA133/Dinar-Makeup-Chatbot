#!/bin/sh
set -eux

echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" > /tmp/sa-key.json
ls -R /app
node app.js
