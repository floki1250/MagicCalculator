import { GoogleGenerativeAI } from "@google/generative-ai";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const API_KEY = config.apiKey;

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const body = await readBody(event);
  if (!body || !body.img) {
    throw new Error("Invalid request body");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const imageData = body.img; // Assuming 'body.img' contains the base64-encoded image data
  if (!/^data:image\/jpeg;base64,/.test(imageData)) {
    console.error(
      "Invalid image data format. Please provide a base64-encoded JPEG image."
    );
    return null;
  }
  try {
    const result = await model.generateContent([
      "solve this",
      {
        inlineData: {
          data: imageData.split(",")[1], // Extract base64 data after "data:image/jpeg;base64,"
          mimeType: "image/jpeg",
        },
      },
    ]);

    const res = result.response;
    console.log(result.response.text());
    return res.text();
  } catch (error) {
    console.error("Error generating JSON:", error);
    throw error;
  }
});
