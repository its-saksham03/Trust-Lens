import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeAppPrivacy(appName: string, category: string, permissions: string[], reviews: string[] = []) {
  const prompt = `
    Analyze the privacy risk for the following mobile app:
    App Name: ${appName}
    Category: ${category}
    Requested Permissions: ${permissions.join(", ")}
    User Reviews: ${reviews.join(" | ")}

    Evaluate:
    1. Permission Misuse: Are the permissions justified for a ${category} app?
    2. Data Collection: Likely data being collected.
    3. Sentiment: Summary of user privacy concerns from reviews.
    4. Trust Score (0-100): Based on Transparency (15%), Permissions (25%), Breach History (15%), and Category Alignment (45%).

    Return JSON format:
    {
      "trustScore": number,
      "riskLevel": "Safe" | "Moderate" | "Risky" | "Dangerous",
      "summary": string,
      "permissionGaps": string[],
      "sentimentScore": number,
      "recommendation": string
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}

export async function parsePrivacyPolicy(urlOrText: string) {
  const prompt = `
    Summarize this privacy policy for a non-technical user. Highlight risky clauses (data sharing, retention, deletion).
    Content: ${urlOrText}
    
    Return JSON format:
    {
      "summary": string,
      "riskyClauses": string[],
      "dataSharedWith": string[],
      "isGDPRCompliant": boolean
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Policy parsing failed:", error);
    return null;
  }
}
