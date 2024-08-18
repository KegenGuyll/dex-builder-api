#!/bin/bash
FROM node:18.18.0-alpine

# Set working directory
WORKDIR /usr/app/app

# Copy "package.json" and "package-lock.json" before other files
# Utilise Docker cacheto save re-installing dependencies if unchanged
COPY ./package*.json ./yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env ./

# Creates a "dist" folder with the production build
RUN yarn build

# Expose the port on which the app will run
EXPOSE 8080

# Start the server using the production build
CMD ["npm", "run", "start:prod"]