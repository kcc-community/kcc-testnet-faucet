FROM node:8

RUN npm install -g pm2

WORKDIR /build

COPY ./ /build
RUN npm install
RUN cd ./public && npm install && npm run sass && npm run coffee

EXPOSE 3000

CMD ["pm2", "start", "-x", "--no-daemon", "index.js"]
