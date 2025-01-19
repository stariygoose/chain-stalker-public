FROM node:23-slim

WORKDIR /bot

COPY ./package.json ./
RUN npm i

COPY . .

RUN npm run build --verbose
CMD ["npm", "run", "start"]