import { GoogleGenAI, Type } from "@google/genai";
import { Investor, PitchAnalysis } from "../types";

// Initialize the client
// NOTE: In a real app, never expose the key in frontend code if possible.
// However, per instructions, we access process.env.API_KEY directly.
const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzePitchDeck = async (text: string): Promise<PitchAnalysis> => {
  const ai = getAiClient();
  
  const prompt = `
    You are a senior investment banker. Analyze the following pitch deck text.
    Extract the structured data.
    
    TEXT:
    ${text}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          industry: { type: Type.STRING },
          stage: { type: Type.STRING },
          askAmount: { type: Type.STRING },
          valueProposition: { type: Type.STRING },
          idealInvestorProfile: { type: Type.STRING },
          summary: { type: Type.STRING },
        },
        required: ["companyName", "industry", "stage", "askAmount", "valueProposition", "idealInvestorProfile", "summary"]
      }
    }
  });

  const jsonText = response.text || "{}";
  return JSON.parse(jsonText) as PitchAnalysis;
};

export const matchInvestors = async (
  analysis: PitchAnalysis,
  investors: Investor[]
): Promise<Investor[]> => {
  const ai = getAiClient();

  const investorsContext = investors.map(inv => 
    `ID: ${inv.id}, Name: ${inv.name}, Firm: ${inv.firm}, Focus: ${inv.focus}, Past Deals: ${inv.pastDeals.join(', ')}`
  ).join('\n---\n');

  const prompt = `
    You are a Placement Agent. 
    
    PITCH DETAILS:
    Company: ${analysis.companyName}
    Industry: ${analysis.industry}
    Stage: ${analysis.stage}
    Summary: ${analysis.summary}
    Ideal Profile: ${analysis.idealInvestorProfile}

    CANDIDATE INVESTORS:
    ${investorsContext}

    Task:
    1. Score each investor from 0 to 100 based on fit.
    2. Provide a 1 sentence reason for the score.
    
    Return a JSON array of objects with 'id', 'matchScore', and 'matchReason'.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            matchScore: { type: Type.INTEGER },
            matchReason: { type: Type.STRING }
          }
        }
      }
    }
  });

  const results = JSON.parse(response.text || "[]");
  
  // Merge results back into investor objects
  return investors.map(inv => {
    const match = results.find((r: any) => r.id === inv.id);
    return match ? { ...inv, matchScore: match.matchScore, matchReason: match.matchReason } : inv;
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};

export const generateColdEmail = async (
  analysis: PitchAnalysis,
  investor: Investor
): Promise<string> => {
  const ai = getAiClient();

  const prompt = `
    Write a warm, professional cold email to ${investor.name} at ${investor.firm}.
    
    Context:
    - We are pitching: ${analysis.companyName}
    - Company Summary: ${analysis.summary}
    - Why it's a match for them specifically: ${investor.matchReason}
    - Their past deals relevant to this: ${investor.pastDeals.join(', ')}
    
    Rules:
    - Keep it under 150 words.
    - Mention why this specific deal fits their portfolio (referencing past deals).
    - Ask for a brief 15-min intro call.
    - No placeholders. Fill in all details.
    - Return ONLY the body of the email.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || "";
};

export const generateEmailSubject = async (
  analysis: PitchAnalysis,
  investor: Investor
): Promise<string> => {
  const ai = getAiClient();
  const prompt = `Generate a catchy, professional email subject line for a cold email to ${investor.name} regarding ${analysis.companyName}. Max 7 words. No quotes.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || `Intro: ${analysis.companyName} x ${investor.firm}`;
}
