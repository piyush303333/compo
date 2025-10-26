import { GoogleGenAI } from "@google/genai";
import type { CpuComparison, GpuComparison } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const callGemini = async (prompt: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        // Attempt to find a JSON block in case the response includes markdown
        const textResponse = response.text.trim();
        const jsonMatch = textResponse.match(/```(json)?\s*([\s\S]+?)\s*```/);
        
        let jsonText;
        if (jsonMatch && jsonMatch[2]) {
            jsonText = jsonMatch[2];
        } else {
            jsonText = textResponse;
        }

        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error calling Gemini API or parsing response:", error);
        if (error instanceof Error) {
            // Provide a more user-friendly message for parsing errors
            if (error.name === 'SyntaxError') {
                throw new Error("Failed to process the comparison data. The format received from the API was invalid. Please try again.");
            }
            throw new Error(`Failed to get data from Gemini: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching data.");
    }
};

export const compareCpus = async (cpu1Name: string, cpu2Name: string): Promise<CpuComparison> => {
    const prompt = `
    You are a CPU comparison expert. Use your search capabilities to find the latest specifications and benchmark scores.
    Compare the following two processors: "${cpu1Name}" and "${cpu2Name}".
    
    Find their technical specifications, power consumption, and the following benchmark scores:
    - Cinebench R23 Multi-Core score
    - Cinebench R23 Single-Core score
    - Idle Power Consumption (in Watts)
    - Peak Power Draw under load (in Watts)
    
    Provide a summary of which is better for performance, value, and gaming, along with an overall recommendation.
    
    Respond ONLY with a single, valid JSON object that conforms to the structure below. Do not include any other text, explanations, or markdown formatting.
    If a value cannot be found, use "N/A".
    
    JSON structure:
    {
      "cpu1": {
        "model": "string",
        "cores": "number",
        "threads": "number",
        "baseClock": "string (e.g., '3.5 GHz')",
        "boostClock": "string (e.g., '5.7 GHz')",
        "tdp": "string (e.g., '125W')",
        "idlePower": "string (e.g., '8W')",
        "peakPower": "string (e.g., '253W')",
        "l3Cache": "string (e.g., '32MB')",
        "socket": "string",
        "integratedGraphics": "string",
        "releaseDate": "string",
        "cinebenchR23MultiCore": "string",
        "cinebenchR23SingleCore": "string"
      },
      "cpu2": { ... same structure as cpu1 ... },
      "summary": {
        "performanceWinner": "string ('cpu1', 'cpu2', or 'tie')",
        "valueWinner": "string ('cpu1', 'cpu2', or 'tie')",
        "gamingWinner": "string ('cpu1', 'cpu2', or 'tie')",
        "overallRecommendation": "string (detailed paragraph)"
      }
    }
    `;

    return callGemini(prompt);
};

export const compareGpus = async (gpu1Name: string, gpu2Name: string): Promise<GpuComparison> => {
    const prompt = `
    You are a GPU comparison expert. Use your search capabilities to find the latest specifications and benchmark scores.
    Compare the following two graphics cards: "${gpu1Name}" and "${gpu2Name}".
    
    Find their technical specifications, power consumption, and the following benchmark scores:
    - 3DMark Time Spy Graphics score
    - 3DMark Port Royal Ray Tracing score
    - Idle Power Consumption (in Watts)
    - Peak Power Draw during gaming (in Watts)
    
    Provide a summary of which is better for performance, value, and gaming, along with an overall recommendation for different resolutions.
    
    Respond ONLY with a single, valid JSON object that conforms to the structure below. Do not include any other text, explanations, or markdown formatting.
    If a value cannot be found, use "N/A".
    
    JSON structure:
    {
      "gpu1": {
        "model": "string",
        "vram": "string (e.g., '16 GB')",
        "memoryType": "string (e.g., 'GDDR6X')",
        "boostClock": "string (e.g., '2520 MHz')",
        "tdp": "string (e.g., '320W')",
        "idlePower": "string (e.g., '15W')",
        "peakPower": "string (e.g., '315W')",
        "architecture": "string",
        "releaseDate": "string",
        "timeSpyGraphicsScore": "string",
        "portRoyalRayTracingScore": "string"
      },
      "gpu2": { ... same structure as gpu1 ... },
      "summary": {
        "performanceWinner": "string ('gpu1', 'gpu2', or 'tie')",
        "valueWinner": "string ('gpu1', 'gpu2', or 'tie')",
        "gamingWinner": "string ('gpu1', 'gpu2', or 'tie')",
        "overallRecommendation": "string (detailed paragraph)"
      }
    }
    `;
    
    return callGemini(prompt);
};