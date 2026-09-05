import OpenAI from "openai";

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-openai-api-key-here") {
    return null;
  }
  return new OpenAI({ apiKey });
}
