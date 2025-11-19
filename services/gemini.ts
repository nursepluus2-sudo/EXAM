import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY;
// Initialize the client. Note: In a real app, handle missing key more gracefully in UI.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

// CHATBOT SERVICE
let chatInstance: Chat | null = null;

export const getChatInstance = (): Chat => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: 'You are a wise and helpful Pharmacology Professor specializing in emergency medicine. You speak Persian (Farsi). Answer questions concisely but accurately. Focus on Epinephrine, Atropine, and Adenosine.',
      },
    });
  }
  return chatInstance;
};

export const sendMessageToChat = async (message: string): Promise<string> => {
  try {
    const chat = getChatInstance();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "متاسفانه پاسخی دریافت نشد.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "خطا در ارتباط با هوش مصنوعی. لطفا کلید API را بررسی کنید.";
  }
};

// THINKING MODE SERVICE
// Analyzes a specific question deeply using Thinking Config
export const analyzeQuestionDeeply = async (question: string, answer: string): Promise<string> => {
  try {
    const prompt = `
      سوال: ${question}
      پاسخ کوتاه: ${answer}
      
      لطفا به عنوان یک متخصص طب اورژانس، مکانیزم اثر دارو و دلیل بالینی این پاسخ را با جزئیات کامل و استدلال علمی تشریح کن. چرا این دوز یا این روش استفاده می‌شود؟ نکات فیزیولوژیک چیست؟
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max budget for deep reasoning
      },
    });

    return response.text || "توضیحی یافت نشد.";
  } catch (error) {
    console.error("Thinking Mode Error:", error);
    return "خطا در پردازش عمیق. ممکن است سهمیه مدل به پایان رسیده باشد.";
  }
};