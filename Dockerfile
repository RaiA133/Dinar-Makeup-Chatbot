# ⚠️ Baris pertama harus FROM
FROM node:20

# Set environment variable untuk credentials Google
ENV GOOGLE_APPLICATION_CREDENTIALS=/tmp/sa-key.json

# Copy script startup
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Copy semua file source code
COPY . .

# Install dependencies
RUN npm install
# atau RUN yarn install jika kamu pakai yarn

# Jalankan startup script
CMD ["/start.sh"]
