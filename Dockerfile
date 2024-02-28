FROM node:21-alpine

COPY . .

RUN yarn install

CMD yarn start
