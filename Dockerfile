FROM node:21-alpine

WORKDIR app

COPY . .

RUN yarn install

CMD yarn start
