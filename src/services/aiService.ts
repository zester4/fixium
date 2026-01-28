import { GoogleGenAI, createUserContent } from "@google/genai";
import type { CapturedPhoto, DiagnosisResult, RepairStep, Part, Tool } from "@/types/repair";

// The API key should be provided via environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface AnalysisResponse {
  diagnosis: DiagnosisResult;
  steps: RepairStep[];
  parts: Part[];
  tools: Tool[];
}

/**
 * Technical Service for AI Repair Analysis
 * Strictly following @google/genai patterns for multiple images
 */
export const analyzeRepairWithGemini = async (
  photos: CapturedPhoto[],
  deviceCategory: string,
  deviceModel?: string,
  deviceCondition?: string
): Promise<AnalysisResponse> => {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not configured in .env");
  }

  // Initialize the connection as per doc pattern
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const systemPrompt = `You are an expert repair technician and diagnostic specialist. Analyze the provided images of a damaged device and provide a comprehensive repair diagnosis.

You must respond with valid JSON only, no markdown formatting. The response must match this exact structure:
{
  "diagnosis": {
    "damages": [
      {
        "type": "string - name of the damage",
        "description": "string - detailed description",
        "severity": "minor" | "moderate" | "severe",
        "location": "string - where on the device"
      }
    ],
    "difficulty": "beginner" | "intermediate" | "advanced",
    "estimatedTime": "string - time range like '30-45 min'",
    "confidence": number between 0-100,
    "failurePredictions": ["string - potential issues during repair"],
    "repairability": "high" | "medium" | "low"
  },
  "steps": [
    {
      "id": "step-1",
      "stepNumber": 1,
      "title": "string - short step title",
      "instruction": "string - detailed instruction",
      "detailedNotes": "string - optional additional notes",
      "toolsRequired": ["string - tool names"],
      "warningLevel": "info" | "caution" | "warning" (optional),
      "warningMessage": "string - warning if applicable",
      "estimatedTime": "string - time for this step",
      "imageAnnotations": [
        {
          "id": "ann-1",
          "type": "hotspot",
          "label": "Screw location",
          "x": 50,
          "y": 50,
          "color": "safe"
        }
      ]
    }
  ],
  "parts": [
    {
      "id": "part-1",
      "name": "string - part name",
      "partNumber": "string - optional part number",
      "estimatedCost": { "min": number, "max": number, "currency": "USD" },
      "suppliers": [{ "name": "string", "url": "string" }],
      "difficulty": "beginner" | "intermediate" | "advanced",
      "isRequired": boolean
    }
  ],
  "tools": [
    {
      "id": "tool-1",
      "name": "string - tool name",
      "icon": "string - icon name",
      "isRequired": boolean,
      "substitutes": ["string - alternative tools"]
    }
  ]
}

Be thorough, accurate, and prioritize safety. Include warnings for dangerous steps. Include imageAnnotations (hotspots) for critical locations in the steps.`;

  const userPrompt = `Analyze this ${deviceCategory}${deviceModel ? ` (${deviceModel})` : ''} which has a reported condition of "${deviceCondition || 'unknown'}". Provide a complete repair diagnosis and step-by-step repair guide. The images show: ${photos.map((p, i) => `${i + 1}) ${p.type} view`).join(', ')}.`;

  // Use createUserContent for complex prompting with multiple images as per updated docs
  const contentParts = [
    systemPrompt,
    userPrompt,
    ...photos.map(photo => {
      const match = photo.dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
      if (!match) throw new Error("Invalid photo data format");

      return {
        inlineData: {
          mimeType: match[1],
          data: match[2]
        }
      };
    })
  ];

  try {
    // Exact method signature from documentation: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: createUserContent(contentParts),
    });

    if (!response || !response.text) {
      throw new Error("No response text from Gemini");
    }

    const text = response.text;

    // Parse the response
    try {
      // Clean potential markdown blocks
      const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("AI returned invalid JSON:", text);
      throw new Error("The AI returned a response that couldn't be parsed. Please try again.");
    }
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    throw error;
  }
};
