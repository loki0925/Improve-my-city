
import { GoogleGenAI, Type } from '@google/genai';
import { Issue } from '../types';
// FIX: Added static import for issueService to avoid using await in a non-async function.
import { getIssueById } from './issueService';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder check. In a real environment, the key would be set.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const generateTagsAndSummary = async (description: string, imageBase64: string, imageMimeType: string): Promise<{ tags: string[], summary: string }> => {
  try {
    const imagePart = fileToGenerativePart(imageBase64.split(',')[1], imageMimeType);

    const prompt = `Analyze the attached image and the user's description of a civic issue. Based on both, provide the following in JSON format:
    1. A short, one-sentence summary of the issue.
    2. An array of 3 to 5 relevant tags for categorization (e.g., 'pothole', 'street_light', 'sanitation', 'road_damage').
    
    User's Description: "${description}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A short, one-sentence summary of the civic issue."
            },
            tags: {
              type: Type.ARRAY,
              description: "An array of 3-5 relevant string tags.",
              items: {
                type: Type.STRING
              }
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error generating tags and summary from Gemini:", error);
    // Provide a fallback in case of API error
    return {
      tags: ['issue'],
      summary: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
    };
  }
};

// For the chatbot, a simple rule-based response is sufficient and more efficient for a hackathon.
export const getChatbotResponse = (issueId: string): string => {
  if (!issueId) {
    return "Please provide a report ID (e.g., 'What is the status of IMC-12345?').";
  }
  
  // This is a direct import from another service, which is fine for this structure.
  // In a larger app, you might pass the data in, but this keeps the chatbot logic clean.
  const issue = getIssueById(issueId.trim().toUpperCase());

  if (issue) {
    return `Report ${issue.id} ( "${issue.title}" ) is currently marked as: ${issue.status}. It was reported on ${new Date(issue.createdAt).toLocaleDateString()}.`;
  } else {
    return `Sorry, I could not find any report with the ID "${issueId}". Please check the ID and try again.`;
  }
};
