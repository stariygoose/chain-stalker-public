FROM node:23-slim

WORKDIR /server

COPY ./package.json ./
RUN npm i

COPY . .

RUN npm run build --verbose
CMD ["npm", "run", "start"]