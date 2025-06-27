# Build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:20 AS runtime
WORKDIR /app
ENV GOOGLE_APPLICATION_CREDENTIALS=/tmp/sa-key.json
COPY start.sh /start.sh
RUN chmod +x /start.sh
COPY --from=build /app ./
CMD ["/start.sh"]
