#!/bin/bash
set -e

SERVER_USER="johannes"
SERVER_HOST="157.180.37.243"
SERVER_PATH="srv/transcendence"

FRONTEND_FOLDER="frontend"
BACKEND_FOLDER="backend"
DATBASE_FOLDER="db"

ROOT_LOCAL="src"

# FRONTEND
# Moving the frontend files to the server
rsync -avz --delete \
  $ROOT_LOCAL/$FRONTEND_FOLDER/dist/ \
  $SERVER_USER@$SERVER_HOST:/$SERVER_PATH/$FRONTEND_FOLDER/

# BACKEND
# Moving the backend files to the server for the general utils
rsync -avz --delete \
  $ROOT_LOCAL/$BACKEND_FOLDER/dist/ \
  $SERVER_USER@$SERVER_HOST:/$SERVER_PATH/$BACKEND_FOLDER/
# We also copy the package files into the same folder for the utils
rsync -avz \
  $ROOT_LOCAL/$BACKEND_FOLDER/package*.json \
  $SERVER_USER@$SERVER_HOST:/$SERVER_PATH/$BACKEND_FOLDER/

# Moving the backend microservice files to the server (should be based on services list)
rsync -avz --delete \
  $ROOT_LOCAL/$BACKEND_FOLDER/user-service/dist/user-service/src/ \
  $SERVER_USER@$SERVER_HOST:/$SERVER_PATH/$BACKEND_FOLDER/user-service/
# We also copy the package files into the same folder for each microservice
rsync -avz \
  $ROOT_LOCAL/$BACKEND_FOLDER/user-service/package*.json \
  $SERVER_USER@$SERVER_HOST:/$SERVER_PATH/$BACKEND_FOLDER/user-service/

# DATABASE
rsync -avz --delete \
  $ROOT_LOCAL/$BACKEND_FOLDER/user-service/db/ \
  $SERVER_USER@$SERVER_HOST:/$SERVER_PATH/$DATBASE_FOLDER/
