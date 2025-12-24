import { GoogleGenAI, Chat } from "@google/genai";

const MODEL_NAME = 'gemini-3-flash-preview'; // Default model as per guidelines for basic text tasks
const SYSTEM_INSTRUCTION = "You are a helpful AI assistant.";

let chatInstance: Chat | null = null;
let googleGenAIInstance: GoogleGenAI | null = null;

const getGoogleGenAI = (): GoogleGenAI => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  // Create a new instance every time to ensure the latest API key is used,
  // especially important for environments where the key might be updated via a dialog.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const startChatSession = async (): Promise<Chat> => {
  try {
    googleGenAIInstance = getGoogleGenAI();
    chatInstance = googleGenAIInstance.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    console.log("Gemini chat session started successfully.");
    return chatInstance;
  } catch (error) {
    console.error("Error starting Gemini chat session:", error);
    throw error;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatInstance) {
    throw new Error("Chat session not initialized. Call startChatSession first.");
  }

  try {
    const response = await chatInstance.sendMessage({ message: message });
    return response.text ?? "No response text found.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    // If the error indicates an API key issue, prompt for re-selection if applicable (e.g., Veo/image models).
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      console.warn("API key might be invalid or has insufficient permissions. Please re-select.");
      // In a real app, you might trigger window.aistudio.openSelectKey() here
      // and re-initialize the chat after selection.
    }
    throw error;
  }
};
