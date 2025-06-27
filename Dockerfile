FROM node:20

ENV GOOGLE_APPLICATION_CREDENTIALS=/tmp/sa-key.json

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
