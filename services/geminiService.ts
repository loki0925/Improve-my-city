import { GoogleGenAI, Type } from '@google/genai';
import { Issue, Priority, ActionPlan } from '../types';
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

export const analyzeIssue = async (description: string, imageBase64: string, imageMimeType: string): Promise<{ tags: string[], summary: string, priority: Priority }> => {
  try {
    const imagePart = fileToGenerativePart(imageBase64.split(',')[1], imageMimeType);

    const prompt = `Analyze the attached image and the user's description of a civic issue. Based on both, provide the following in JSON format:
    1. A short, one-sentence summary of the issue.
    2. An array of 3 to 5 relevant tags for categorization (e.g., 'pothole', 'street_light', 'sanitation', 'road_damage').
    3. A priority level for the issue. The priority can be one of: "Low", "Medium", "High", or "Critical". A fire, major accident, or exposed live wire should be "Critical". A large pothole on a busy road might be "High". A faded sign might be "Medium". Minor graffiti would be "Low".
    
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
            },
            priority: {
              type: Type.STRING,
              description: "The priority of the issue.",
              enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL]
            }
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error analyzing issue from Gemini:", error);
    // Provide a fallback in case of API error
    return {
      tags: ['issue'],
      summary: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
      priority: Priority.MEDIUM,
    };
  }
};

export const suggestActionPlan = async (issue: Issue): Promise<ActionPlan> => {
  try {
    const prompt = `An administrator needs an action plan for the following civic issue. Based on the details provided, generate a concise work order.
    
    Issue Title: "${issue.title}"
    Issue Summary: "${issue.summary}"
    Description: "${issue.description}"
    Priority: "${issue.priority}"
    Tags: ${issue.tags.join(', ')}

    Please provide the following in JSON format:
    1. "steps": An array of 2-4 short, actionable steps to resolve the issue.
    2. "crew": The type of municipal crew that should be assigned (e.g., "Road Maintenance Crew", "Sanitation Department", "Electrical Services", "Parks and Recreation Team").
    3. "estimatedHours": A number representing the estimated hours to complete the work.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              description: "An array of 2-4 actionable steps.",
              items: {
                type: Type.STRING
              }
            },
            crew: {
              type: Type.STRING,
              description: "The type of crew to assign."
            },
            estimatedHours: {
              type: Type.NUMBER,
              description: "Estimated hours to complete the work."
            }
          }
        }
      }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error suggesting action plan from Gemini:", error);
    throw new Error("Failed to generate an action plan. The AI service may be temporarily unavailable.");
  }
};


export const getChatbotResponse = async (issueId: string): Promise<string> => {
  if (!issueId) {
    return "Please provide a report ID (e.g., 'What is the status of a report? Please include the full ID.').";
  }
  
  const issue = await getIssueById(issueId.trim());

  if (issue) {
    return `Report ${issue.id} ( "${issue.title}" ) is currently marked as: ${issue.status}. It was reported on ${new Date(issue.createdAt).toLocaleDateString()}.`;
  } else {
    return `Sorry, I could not find any report with the ID "${issueId}". Please check the ID and try again.`;
  }
};