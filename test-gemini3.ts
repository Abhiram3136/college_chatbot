import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  
  try {
    const result = await model.embedContent("test single");
    console.log("Single embed success, length:", result.embedding.values.length);
  } catch (e: any) {
    console.error("Error single:", e.message);
  }
}
test();
