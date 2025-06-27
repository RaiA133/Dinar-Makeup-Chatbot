ENV GOOGLE_APPLICATION_CREDENTIALS=/tmp/sa-key.json
COPY start.sh /start.sh
COPY . .
RUN chmod +x /start.sh
CMD ["/start.sh"]

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]

