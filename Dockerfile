# Stage 1: Build the React app
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN yarn build

# Stage 2: Prepare the build output
FROM node:20

WORKDIR /app

# Copy build artifacts from the builder stage
COPY --from=builder /app/build ./build

CMD ["yarn", "start"]
