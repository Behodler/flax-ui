# Use an official lightweight Node image based on Alpine
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Expose the port the app runs on
EXPOSE 3000

# Set the command to start the app (This will be overridden by docker-compose)
CMD ["yarn", "start"]
