# Simpan Google credentials ke file
echo "$GOOGLE_APPLICATION_CREDENTIALS_JSON" > /tmp/sa-key.json

# Jalankan aplikasi
node index.js
