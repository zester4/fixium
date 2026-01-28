// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  photos: { type: string; dataUrl: string }[];
  deviceCategory: string;
  deviceModel?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { photos, deviceCategory, deviceModel } = await req.json() as AnalyzeRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the image content for the AI
    const imageContents = photos.map((photo, index) => ({
      type: "image_url" as const,
      image_url: { url: photo.dataUrl }
    }));

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
      "estimatedTime": "string - time for this step"
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

Be thorough, accurate, and prioritize safety. Include warnings for dangerous steps.`;

    const userPrompt = `Analyze this ${deviceCategory}${deviceModel ? ` (${deviceModel})` : ''} and provide a complete repair diagnosis and step-by-step repair guide. The images show: ${photos.map((p, i) => `${i + 1}) ${p.type} view`).join(', ')}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: userPrompt },
              ...imageContents
            ]
          }
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response, handling potential markdown code blocks
    let parsed;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse repair analysis");
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("analyze-repair error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to analyze repair" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
