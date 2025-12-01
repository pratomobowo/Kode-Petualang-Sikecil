import { GoogleGenAI } from "@google/genai";
import { Command, LevelConfig, Position, TileType } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRoboHint = async (
  level: LevelConfig,
  currentCommands: Command[],
  failureReason: string,
  robotPosition: Position
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Ups! Kunci API belum dipasang. Minta orang tua untuk cek ya!";
  }

  try {
    const prompt = `
      You are a friendly robot helper named "Robo" for a 7-year-old child learning coding logic (Indonesian language).
      The child is playing a grid-based movement game.
      
      Context:
      - Level Goal: Get to the Goal (TileType.GOAL) while collecting stars.
      - Grid Size: ${level.gridSize}x${level.gridSize}.
      - Current Robot Position: (${robotPosition.x}, ${robotPosition.y}).
      - Goal Position: Logic to find GOAL in layout.
      - User's Command Sequence: ${currentCommands.map(c => c.direction).join(', ')}.
      - Why they failed: ${failureReason}.

      Task:
      Give a very short, encouraging hint in Indonesian (Bahasa Indonesia). 
      Do NOT give the direct answer. 
      Use simple words suitable for a 1st grader.
      Example: "Hati-hati, ada batu di depan! Coba belok kiri dulu." or "Wah hampir sampai! Tapi kita butuh belok kanan."
      Keep it under 20 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Semangat! Coba cek arah panahmu lagi ya.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Robo sedang bingung... Coba lagi ya!";
  }
};

export const getWinMessage = async (starsCollected: number): Promise<string> => {
  if (!process.env.API_KEY) return "Hebat! Kamu berhasil!";

  try {
    const prompt = `
      Write a short celebration message in Indonesian for a 7-year-old who just finished a coding puzzle.
      They collected ${starsCollected} stars.
      Be enthusiastic! Use emojis. Max 15 words.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Yey! Kamu hebat sekali! 🎉";
  } catch (error) {
    return "Hore! Kamu menang! 🌟";
  }
}
