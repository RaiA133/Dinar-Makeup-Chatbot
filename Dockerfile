FROM node:20

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

CMD ["yarn", "start"] # atau perintah lain sesuai apps-mu
