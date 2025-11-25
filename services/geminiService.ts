import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EmpathyAnalysis, Post, Goal, SynergyMatch, User } from "../types";

// Initialize Gemini
// Note: In a real app, strict error handling for missing API key is needed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Empathy Filter ---

export const analyzeSentiment = async (text: string): Promise<EmpathyAnalysis> => {
  if (!process.env.API_KEY) {
    // Mock response if no key provided for demo purposes
    return { isToxic: false, score: 85, consequencePrediction: "This seems neutral." };
  }

  const model = "gemini-2.5-flash";
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isToxic: { type: Type.BOOLEAN, description: "Whether the text contains harassment, rage-bait, or aggression." },
      score: { type: Type.NUMBER, description: "A score from 0 (toxic) to 100 (kind/constructive)." },
      constructiveRewrite: { type: Type.STRING, description: "A kinder, more constructive version of the text if it was toxic." },
      consequencePrediction: { type: Type.STRING, description: "A short 'Future Echo' predicting how this might hurt the user's reputation." },
    },
    required: ["isToxic", "score", "consequencePrediction"],
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents: `Analyze this social media draft for toxicity and emotional impact: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are the 'Guardian AI', a protective system designed to foster empathy. Analyze the input text.",
      },
    });

    const json = JSON.parse(result.text || "{}");
    return json as EmpathyAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return { isToxic: false, score: 50 };
  }
};

// --- Goal-Oriented Feed Sorting ---

export const filterFeedByGoal = async (posts: Post[], goal: Goal): Promise<string[]> => {
  if (!process.env.API_KEY) return posts.map(p => p.id); // Return all if no key

  const postsSummary = posts.map(p => ({ id: p.id, content: p.content, topics: p.relatedTopics }));
  
  const model = "gemini-2.5-flash";
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      selectedIds: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of Post IDs that align with the user's goal." 
      }
    }
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents: `User Goal: "${goal.label}". Filter these posts to match the goal. Posts: ${JSON.stringify(postsSummary)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    
    const json = JSON.parse(result.text || "{}");
    return json.selectedIds || [];
  } catch (e) {
    console.error("Feed Filtering Failed", e);
    return posts.map(p => p.id);
  }
};

// --- Synergy Finder ---

export const findSynergy = async (userGoal: string, network: User[]): Promise<SynergyMatch[]> => {
    if (!process.env.API_KEY) return [];

    const networkSummary = network.map(u => ({ name: u.name, skills: u.skills, id: u.id }));
    const model = "gemini-2.5-flash";
    
    const schema: Schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                userId: { type: Type.STRING },
                reason: { type: Type.STRING, description: "Why this person is a match." }
            }
        }
    };

    try {
        const result = await ai.models.generateContent({
            model,
            contents: `I need help with: "${userGoal}". Who in my network can help? Network: ${JSON.stringify(networkSummary)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const matches = JSON.parse(result.text || "[]");
        
        // Map back to full user objects
        return matches.map((m: any) => ({
            user: network.find(u => u.id === m.userId),
            reason: m.reason
        })).filter((m: any) => m.user !== undefined);

    } catch (e) {
        return [];
    }
}
