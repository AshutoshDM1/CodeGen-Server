import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import dotenv from 'dotenv';

dotenv.config();

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const groq = createGroq({
  apiKey: process.env.GroqAI || process.env.GROQ_API_KEY,
});

// Switch to Gemini model to avoid Groq's low TPM limits
export const activeModel = google('gemini-3.1-flash-lite');
