
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { BrowserIntent, MockPage } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async planActions(prompt: string, currentPage: MockPage): Promise<BrowserIntent> {
    const context = `
CURRENT URL: ${currentPage.url}
PAGE CONTENT: ${currentPage.content}
PAGE DOM: ${currentPage.dom}
USER PROMPT: ${prompt}
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: context,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.1, // Lower temperature for deterministic automation steps
        },
      });

      const text = response.text || "{}";
      const cleanJson = text.trim();
      return JSON.parse(cleanJson) as BrowserIntent;
    } catch (error) {
      console.error("Gemini Planning Error:", error);
      throw new Error("Failed to plan browser actions. " + (error as Error).message);
    }
  }

  async summarizePage(content: string): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Please summarize the following webpage content concisely: ${content}`,
      });
      return response.text || "No summary available.";
    } catch (error) {
      console.error("Gemini Summarize Error:", error);
      return "Error summarizing page.";
    }
  }
}
