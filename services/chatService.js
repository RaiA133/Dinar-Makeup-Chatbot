import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file for local development
dotenv.config();

// --- START: Kredensial Google Cloud untuk Deployment di Railway ---
// Mendapatkan __dirname untuk menulis file sementara
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path untuk menyimpan file JSON kredensial sementara
// Gunakan /tmp/ karena ini adalah lokasi ephemeral yang bisa ditulis di kebanyakan lingkungan container
const TEMP_GCP_CREDENTIALS_FILE = '/tmp/gcp_service_account.json';

// Cek apakah variabel lingkungan GOOGLE_APPLICATION_CREDENTIALS_BASE64 ada (dari Railway)
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
  try {
    const encodedKey = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
    const decodedKey = Buffer.from(encodedKey, 'base64').toString('utf-8');

    // Tulis kunci yang di-decode ke file sementara
    fs.writeFileSync(TEMP_GCP_CREDENTIALS_FILE, decodedKey);

    // Set variabel lingkungan GOOGLE_APPLICATION_CREDENTIALS agar library Google dapat menemukannya
    process.env.GOOGLE_APPLICATION_CREDENTIALS = TEMP_GCP_CREDENTIALS_FILE;
    console.log('Google Cloud credentials successfully loaded from base64 environment variable.');
  } catch (error) {
    console.error('Error decoding or writing Google Cloud credentials:', error);
    // Penting: Jangan lanjutkan jika kredensial tidak dapat dimuat
    process.exit(1);
  }
} else {
  console.log('GOOGLE_APPLICATION_CREDENTIALS_BASE64 not found. Relying on default ADC behavior (e.g., gcloud login or existing GOOGLE_APPLICATION_CREDENTIALS).');
}
// --- END: Kredensial Google Cloud untuk Deployment di Railway ---

// Initialize Vertex with your Cloud project and location
// Pastikan GOOGLE_CLOUD_PROJECT dan GOOGLE_CLOUD_LOCATION disetel di env Railway Anda
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION,
});

const model = 'gemini-2.5-flash';
const rag = process.env.GOOGLE_CLOUD_RESOURCE_RAG; // Pastikan ini juga disetel
const system = { text: `Nama anda dinar, anda adalah Assisten Virtual dari perusahaan Dinar Makeup, sebuah jasa Wedding Organizer dan juga Makeup Profesional.` };
 
const generationConfig = {
  maxOutputTokens: 65535,
  temperature: 1,
  topP: 1,
  seed: 0,
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'OFF',
    }
  ],
  tools: [
    {
      retrieval: {
        vertexRagStore: {
          ragResources: [
            {
              ragCorpus: rag
            }
          ],
          similarityTopK: 20
        }
      }
    }
  ],
  systemInstruction: {
    parts: [system]
  },
};


const chat = ai.chats.create({
  model: model,
  config: generationConfig
});

export async function askChat(message) {
  try {
    const response = await chat.sendMessageStream({
      message: {text: message}
    });

    let result = '';
    for await (const chunk of response) {
      if (chunk.text) result += chunk.text;
      else result += JSON.stringify(chunk) + '\n'
    }
    return result;
  } catch (error) {
    console.error("Error in askChat:", error);
    throw error; // Melempar error agar bisa ditangani di tempat pemanggilan
  }
}

// Contoh penggunaan (jika ini adalah skrip yang dieksekusi langsung)
// if (process.argv[2]) {
//   askChat(process.argv[2]).then(res => console.log(res)).catch(e => console.error(e));
// } else {
//   console.log("Usage: node your_script_name.js 'Your message here'");
// }