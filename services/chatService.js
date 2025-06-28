import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
    fs.writeFileSync(TEMP_GCP_CREDENTIALS_FILE, decodedKey); // Tulis kunci yang di-decode ke file sementara
    process.env.GOOGLE_APPLICATION_CREDENTIALS = TEMP_GCP_CREDENTIALS_FILE; // Set variabel lingkungan GOOGLE_APPLICATION_CREDENTIALS agar library Google dapat menemukannya
    console.log('Google Cloud credentials successfully loaded from base64 environment variable.');
  } catch (error) {
    console.error('Error decoding or writing Google Cloud credentials:', error);
    process.exit(1); // Penting: Jangan lanjutkan jika kredensial tidak dapat dimuat
  }
} else {
  console.log('GOOGLE_APPLICATION_CREDENTIALS_BASE64 not found. Relying on default ADC behavior (e.g., gcloud login or existing GOOGLE_APPLICATION_CREDENTIALS).');
}
// --- END: Kredensial Google Cloud untuk Deployment di Railway ---

// ==========================================================================================================================================================================

/* 
INI ADALAH SYSTEM VERTEX AI + RAG Enginge DIAMAN DATA RAG DIUPLOAD 
DARI DATA PDF PRICELIST PERUSAHAAN DAN HASIL CRAWL OLEH CRAWL4AI
*/
export async function askChat(message, system, history = []) {

  const ai = new GoogleGenAI({
    vertexai: true,
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION,
  });

  const model = 'gemini-2.5-flash';
  const rag = process.env.GOOGLE_CLOUD_RESOURCE_RAG; // Pastikan ini juga disetel

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
    // systemInstruction: {
    //   parts: [{ text: system }]
    // },
  };


  const chat = ai.chats.create({
    model: model,
    config: generationConfig,
    history: [
      {
        role: "model",
        parts: [{ text: system }],
      },
      ...history
    ],
  });

  try {
    const response = await chat.sendMessageStream({
      message: { text: message }
    });

    let result = '';
    for await (const chunk of response) {
      if (chunk.text) result += chunk.text;
      else result += JSON.stringify(chunk) + '\n'
    }
    return result;
  } catch (error) {
    console.error("Error in askChat:", error);
    throw error;
  }
}