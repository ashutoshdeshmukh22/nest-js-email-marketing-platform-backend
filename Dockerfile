# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --production

COPY . .

RUN npm install -g @nestjs/cli

RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --production

EXPOSE 4000

CMD [ "node", "dist/src/main.js" ]
