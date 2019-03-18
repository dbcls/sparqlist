#!/bin/bash

npm run build
npm start &
PID=$!
npx cypress --spec cypress/integration/**/*_spec.js
kill $PID
wait $PID

ROOT_PATH=/foo/ npm run build
ROOT_PATH=/foo/ npm start &
PID=$!
npx cypress --spec cypress/integration-subdirectory-deployment/**/*_spec.js
kill $PID
wait $PID
