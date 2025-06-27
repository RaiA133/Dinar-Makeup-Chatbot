#!/bin/sh
echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" > /tmp/sa-key.json
node dist/index.js
