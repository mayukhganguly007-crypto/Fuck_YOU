
import { GoogleGenAI, Type } from "@google/genai";
import { NeuralState, TelemetryReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNeuralReport = async (state: NeuralState): Promise<TelemetryReport> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a highly technical neural telemetry report for a 'Brain-Drain' satellite tracking system. 
      Current Stats:
      - Active Region: ${state.activeRegion}
      - Synaptic Load: ${state.synapticLoad}%
      - Sync Rate: ${state.syncRate}%
      - Satellite Optimization Level: ${state.optimizationLevel}
      - Latency: ${state.latency}ms
      
      Respond in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            threatLevel: { 
              type: Type.STRING,
              description: "Must be 'Low', 'Moderate', or 'Critical'"
            }
          },
          required: ["summary", "recommendations", "threatLevel"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return {
      ...data,
      timestamp: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error("Failed to generate report:", error);
    return {
      timestamp: new Date().toLocaleTimeString(),
      summary: "Calibration error in neural relay. Satellite cluster signal unstable.",
      recommendations: ["Manually recalibrate satellite dish", "Increase power to orbital transceiver"],
      threatLevel: "Moderate"
    };
  }
};
