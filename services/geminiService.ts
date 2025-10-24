import { GoogleGenAI, Type } from "@google/genai";
import type { CpuComparison, GpuComparison } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// --- CPU Schemas ---
const cpuSpecSchema = {
    type: Type.OBJECT,
    properties: {
        model: { type: Type.STRING, description: "Processor model name" },
        cores: { type: Type.INTEGER, description: "Number of physical cores" },
        threads: { type: Type.INTEGER, description: "Number of threads" },
        baseClock: { type: Type.STRING, description: "Base clock speed in GHz (e.g., '3.5 GHz')" },
        boostClock: { type: Type.STRING, description: "Max boost clock speed in GHz (e.g., '5.7 GHz')" },
        tdp: { type: Type.STRING, description: "Thermal Design Power in Watts (e.g., '125W')" },
        l3Cache: { type: Type.STRING, description: "L3 Cache size in MB (e.g., '32MB')" },
        socket: { type: Type.STRING, description: "CPU socket type (e.g., 'AM5', 'LGA1700')" },
        integratedGraphics: { type: Type.STRING, description: "Name of integrated graphics or 'N/A'" },
        releaseDate: { type: Type.STRING, description: "Release date (e.g., 'Q3 2023')" },
    },
    required: ["model", "cores", "threads", "baseClock", "boostClock", "tdp", "l3Cache", "socket", "integratedGraphics", "releaseDate"]
};

const cpuComparisonSchema = {
    type: Type.OBJECT,
    properties: {
        cpu1: cpuSpecSchema,
        cpu2: cpuSpecSchema,
        summary: {
            type: Type.OBJECT,
            properties: {
                performanceWinner: { type: Type.STRING, description: "Which CPU is better for overall performance. Should be one of 'cpu1', 'cpu2', or 'tie'." },
                valueWinner: { type: Type.STRING, description: "Which CPU offers better value for money. Should be one of 'cpu1', 'cpu2', or 'tie'." },
                gamingWinner: { type: Type.STRING, description: "Which CPU is better for gaming. Should be one of 'cpu1', 'cpu2', or 'tie'." },
                overallRecommendation: { type: Type.STRING, description: "A detailed paragraph explaining the recommendation for different use cases." },
            },
            required: ["performanceWinner", "valueWinner", "gamingWinner", "overallRecommendation"]
        }
    },
    required: ["cpu1", "cpu2", "summary"]
};

// --- GPU Schemas ---
const gpuSpecSchema = {
    type: Type.OBJECT,
    properties: {
        model: { type: Type.STRING, description: "Graphics card model name" },
        vram: { type: Type.STRING, description: "Amount of VRAM (e.g., '16 GB')" },
        memoryType: { type: Type.STRING, description: "Type of memory (e.g., 'GDDR6X')" },
        boostClock: { type: Type.STRING, description: "Boost clock speed in MHz (e.g., '2520 MHz')" },
        tdp: { type: Type.STRING, description: "Total Graphics Power in Watts (e.g., '320W')" },
        architecture: { type: Type.STRING, description: "GPU architecture name (e.g., 'Ada Lovelace')" },
        releaseDate: { type: Type.STRING, description: "Release date (e.g., 'Q4 2022')" },
    },
    required: ["model", "vram", "memoryType", "boostClock", "tdp", "architecture", "releaseDate"]
};

const gpuComparisonSchema = {
    type: Type.OBJECT,
    properties: {
        gpu1: gpuSpecSchema,
        gpu2: gpuSpecSchema,
        summary: {
            type: Type.OBJECT,
            properties: {
                performanceWinner: { type: Type.STRING, description: "Which GPU is better for overall performance. Should be one of 'gpu1', 'gpu2', or 'tie'." },
                valueWinner: { type: Type.STRING, description: "Which GPU offers better value for money. Should be one of 'gpu1', 'gpu2', or 'tie'." },
                gamingWinner: { type: Type.STRING, description: "Which GPU is better for gaming. Should be one of 'gpu1', 'gpu2', or 'tie'." },
                overallRecommendation: { type: Type.STRING, description: "A detailed paragraph explaining the recommendation for different use cases (e.g., 1080p, 1440p, 4K gaming, content creation)." },
            },
            required: ["performanceWinner", "valueWinner", "gamingWinner", "overallRecommendation"]
        }
    },
    required: ["gpu1", "gpu2", "summary"]
};

// --- API Functions ---
const callGemini = async (prompt: string, schema: object) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get data from Gemini: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching data.");
    }
};

export const compareCpus = async (cpu1Name: string, cpu2Name: string): Promise<CpuComparison> => {
    const prompt = `You are a CPU comparison expert. Compare the following two processors: "${cpu1Name}" and "${cpu2Name}". 
    Provide a detailed technical specification comparison and a summary of which is better for performance, value, and gaming. 
    Give an overall recommendation. 
    Respond ONLY with a JSON object that conforms to the provided schema. Do not include any other text, explanations, or markdown formatting. 
    If you cannot find a spec, provide a reasonable estimate or "N/A".`;

    return callGemini(prompt, cpuComparisonSchema);
};

export const compareGpus = async (gpu1Name: string, gpu2Name: string): Promise<GpuComparison> => {
    const prompt = `You are a GPU comparison expert. Compare the following two graphics cards: "${gpu1Name}" and "${gpu2Name}". 
    Provide a detailed technical specification comparison and a summary of which is better for performance, value, and gaming. 
    Give an overall recommendation for different resolutions and workloads.
    Respond ONLY with a JSON object that conforms to the provided schema. Do not include any other text, explanations, or markdown formatting. 
    If you cannot find a spec, provide a reasonable estimate or "N/A".`;
    
    return callGemini(prompt, gpuComparisonSchema);
};
