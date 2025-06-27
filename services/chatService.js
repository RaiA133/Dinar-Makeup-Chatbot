import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Vertex with your Cloud project and location
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION,
});
const model = 'gemini-2.5-flash';
const rag = process.env.GOOGLE_CLOUD_RESOURCE_RAG
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
  ]
  ,
  systemInstruction: {
    parts: [system]
  },
};


const chat = ai.chats.create({
  model: model,
  config: generationConfig
});

export async function askChat(message) {
  const response = await chat.sendMessageStream({
    message: {text: message}
  });

  let result = '';
  for await (const chunk of response) {
    if (chunk.text) result += chunk.text;
    else result += JSON.stringify(chunk) + '\n'
  }
  return result
}













