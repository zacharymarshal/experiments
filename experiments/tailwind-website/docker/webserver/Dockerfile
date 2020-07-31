FROM node:12.16.1-alpine

RUN apk add --no-cache \
        git \
    && npm install -g npm \
    && npm install -g http-server

WORKDIR /app

ENTRYPOINT http-server --port 80 -c-1
