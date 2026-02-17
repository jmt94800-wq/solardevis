
import { GoogleGenAI } from "@google/genai";
import { ClientProfile } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEnergyAnalysis = async (profile: ClientProfile) => {
  const prompt = `
    En tant qu'expert en énergie solaire, analyse le profil de consommation suivant pour un client résidentiel.
    Client: ${profile.name}
    Adresse: ${profile.address}
    Consommation journalière totale estimée: ${profile.totalDailyKWh.toFixed(2)} kWh
    Puissance de crête (tout allumé): ${profile.totalMaxW} W
    
    Détails des appareils:
    ${profile.items.map(i => `- ${i.appareil}: ${i.puissanceHoraireKWh}kWh/h, ${i.dureeHj}h/j, Qte: ${i.quantite}`).join('\n')}

    Fournis une analyse professionnelle courte (en français) incluant:
    1. Une évaluation de la pertinence d'une installation photovoltaïque.
    2. Le dimensionnement conseillé (en kWc).
    3. Un conseil spécifique sur la gestion des appareils (ex: optimiser le ballon thermodynamique ou la borne VE).
    4. Une estimation des économies annuelles potentielles.

    Réponds en format Markdown structuré.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Désolé, l'analyse automatique n'est pas disponible pour le moment.";
  }
};
