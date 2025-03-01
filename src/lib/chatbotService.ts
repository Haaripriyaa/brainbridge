
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDuj1KVO1n6OCCbMH0KX-0B4pPlkfc6xaU"; // API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 80,
    responseMimeType: "text/plain",
};

export async function getChatResponse(userMessage: string): Promise<string> {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [
                        { text: userMessage },
                    ],
                },
            ],
        });

        const result = await chatSession.sendMessage(userMessage);
        return result.response.text();
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
    }
}
