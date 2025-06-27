FROM node:20

# Install yarn globally
RUN npm install -g yarn

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

CMD ["yarn", "start"]
