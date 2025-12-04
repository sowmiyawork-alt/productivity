import { GoogleGenAI, Type } from "@google/genai";
import type { DailyContent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    wordOfTheDay: {
      type: Type.OBJECT,
      properties: {
        word: { type: Type.STRING, description: "A high-end, single business or tech-related word." },
        definition: { type: Type.STRING, description: "A concise definition of the word." },
      },
      required: ["word", "definition"]
    },
    thoughtOfTheDay: {
      type: Type.STRING,
      description: "A short, powerful motivational quote or thought."
    },
    studyPlan: {
      type: Type.OBJECT,
      properties: {
        mathTopic: { 
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "A specific O-level mathematics topic for today's study." },
            explanation: { type: Type.STRING, description: "A concise, 2-minute read explanation of the math topic. Use newlines for paragraphs." }
          },
           required: ["topic", "explanation"]
        },
        scienceTopic: { 
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "A specific O-level science (Physics, Chemistry, or Biology) topic for today's study." },
            explanation: { type: Type.STRING, description: "A concise, 2-minute read explanation of the science topic. Use newlines for paragraphs." }
          },
          required: ["topic", "explanation"]
        },
      },
       required: ["mathTopic", "scienceTopic"]
    },
    techConcept: {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING, description: "The name of the tech concept field (e.g., 'Robotics', 'AI Concepts')." },
        explanation: { type: Type.STRING, description: "A detailed but concise explanation of a fundamental concept from the topic, suitable for a 5-minute read. Use newlines for paragraphs." },
      },
      required: ["topic", "explanation"]
    },
  },
  required: ["wordOfTheDay", "thoughtOfTheDay", "studyPlan", "techConcept"]
};

export async function getDailyContent(): Promise<DailyContent> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate today's content for a productivity hub: a high-end business/tech word of the day, a motivational thought, one O-level math topic and one O-level science topic (for each, provide a short 2-minute read explanation), and a 5-minute read on a fundamental concept from one of the following fields: Basics of Computers, IT Networks, Robotics, or AI.",
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text content returned from Gemini API");
    }

    const jsonText = text.trim();
    const parsedContent = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed object matches the expected structure
    if (
        !parsedContent.wordOfTheDay ||
        !parsedContent.thoughtOfTheDay ||
        !parsedContent.studyPlan?.mathTopic?.explanation ||
        !parsedContent.studyPlan?.scienceTopic?.explanation ||
        !parsedContent.techConcept
      ) {
        throw new Error("Received malformed data from API");
    }

    return parsedContent as DailyContent;

  } catch (error) {
    console.error("Error fetching daily content from Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}
