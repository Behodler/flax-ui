#!/bin/bash

# Build the Docker images
docker compose build

# Run the build service
docker compose up build

# Copy the build directory to local machine
docker cp $(docker compose ps -q build):/app/out_build ./build
