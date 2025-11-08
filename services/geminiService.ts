import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Quiz } from '../types';

// Fix: Removed global declaration to resolve conflict. It's now in types.ts.

const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API_KEY environment variable not set");
  }
  return key;
};


export const summarizeContent = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following study material into key points suitable for an educational video script. Keep it concise and engaging for students:\n\n---\n\n${text}`,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing content:", error);
    throw new Error("Failed to summarize content. Please check your API key and try again.");
  }
};

export const generateVideo = async (summary: string, image?: string): Promise<{ url: string; blob: Blob; }> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  try {
    const payload: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Create a short, visually engaging educational video explaining this topic: ${summary}. The style should be modern and appealing to students, similar to a high-quality educational YouTube video.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    };

    if (image) {
      payload.image = {
        imageBytes: image,
        mimeType: 'image/jpeg',
      };
    }
    
    let operation = await ai.models.generateVideos(payload);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }

    const response = await fetch(`${downloadLink}&key=${getApiKey()}`);
    const blob = await response.blob();
    return {
      url: URL.createObjectURL(blob),
      blob,
    };

  } catch (error) {
    console.error("Error generating video:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
         throw new Error("API Key validation failed. Please select a valid API key and try again.");
    }
    throw new Error("Failed to generate video. This is an experimental feature and may take a few minutes.");
  }
};

export const generateQuiz = async (text: string): Promise<Quiz> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the following study material, create a multiple-choice quiz with a title and 5 questions. For each question, provide 4 options and clearly indicate the correct answer.

            Study Material:
            ---
            ${text}
            ---
            `,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswer: { type: Type.STRING }
                                },
                                required: ['question', 'options', 'correctAnswer']
                            }
                        }
                    },
                    required: ['title', 'questions']
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Quiz;

    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. Please check your input and API key.");
    }
};

export const createChat = () => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are Ace, a friendly and encouraging AI tutor. Your goal is to help students understand their study material better. Keep your explanations clear, concise, and interactive. Ask follow-up questions to check for understanding.',
        },
    });
};