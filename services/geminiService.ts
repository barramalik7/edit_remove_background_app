import { GoogleGenAI } from "@google/genai";
import { ImageData, GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithGemini = async (
  image: ImageData,
  prompt: string
): Promise<GenerationResult> => {
  try {
    const model = "gemini-2.5-flash-image";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    let generatedImageUrl: string | null = null;
    let textResponse: string | null = null;

    // Parse response for image or text
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          // Assume PNG if not specified, but usually the model returns consistent formats.
          // Typically the output mimetype is not explicitly in inlineData object in the TS definition 
          // for all versions, but we can construct a displayable URL.
          generatedImageUrl = `data:image/png;base64,${base64String}`;
        } else if (part.text) {
          textResponse = part.text;
        }
      }
    }

    return {
      imageUrl: generatedImageUrl,
      textResponse: textResponse,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
