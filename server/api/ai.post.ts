import { GoogleGenerativeAI } from "@google/generative-ai";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const API_KEY = config.apiKey;
  console.log(API_KEY);
  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const body = await readBody(event);
  if (!body || !body.img) {
    throw new Error("Invalid request body");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent([
      "What is in this photo?",
      {
        inlineData: body.img,
      },
    ]);

    const res = result.response;
    console.log(result.response.text());
    return res;
  } catch (error) {
    console.error("Error generating JSON:", error);
    throw error;
  }
});
