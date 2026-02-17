
export interface ProspectEntry {
  client: string;
  lieu: string;
  adresse: string;
  date: string;
  agent: string;
  appareil: string;
  puissanceHoraireKWh: number;
  puissanceMaxW: number;
  dureeHj: number;
  quantite: number;
}

export interface ClientProfile {
  name: string;
  address: string;
  siteName: string;
  visitDate: string;
  items: ProspectEntry[];
  totalDailyKWh: number;
  totalMaxW: number;
}

export interface QuoteCalculations {
  recommendedPanels: number;
  estimatedSystemCost: number;
  roiYears: number;
  annualSavings: number;
}
