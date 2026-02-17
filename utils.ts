
import { ProspectEntry, ClientProfile } from './types';

export const parseCSV = (csvText: string): ProspectEntry[] => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Remove BOM if present and split by semicolon
  const headers = lines[0].replace(/^\ufeff/, '').split(';');
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    // Regex to handle quoted strings containing semicolons if any
    const values = line.split(';').map(v => v.replace(/^"|"$/g, '').trim());
    
    // Helper to parse French decimal commas
    const parseFrFloat = (val: string) => parseFloat(val.replace(',', '.'));

    return {
      client: values[0],
      lieu: values[1],
      adresse: values[2],
      date: values[3],
      agent: values[4],
      appareil: values[5],
      puissanceHoraireKWh: parseFrFloat(values[6]),
      puissanceMaxW: parseFrFloat(values[7]),
      dureeHj: parseFrFloat(values[8]),
      quantite: parseInt(values[9], 10) || 0
    };
  });
};

export const groupByClient = (entries: ProspectEntry[]): ClientProfile[] => {
  const groups: Record<string, ProspectEntry[]> = {};
  
  entries.forEach(entry => {
    const key = `${entry.client}-${entry.adresse}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  });

  return Object.values(groups).map(items => {
    const first = items[0];
    const dailyKWh = items.reduce((sum, i) => sum + (i.puissanceHoraireKWh * i.dureeHj * i.quantite), 0);
    const maxW = items.reduce((sum, i) => sum + (i.puissanceMaxW * i.quantite), 0);

    return {
      name: first.client,
      address: first.adresse,
      siteName: first.lieu,
      visitDate: first.date,
      items,
      totalDailyKWh: dailyKWh,
      totalMaxW: maxW
    };
  });
};

export const calculateSolarSpecs = (dailyKWh: number) => {
  // Rough estimation: 1kWp produces ~3.5kWh/day on average in France
  const neededKWp = dailyKWh / 3.5;
  const panelCount = Math.ceil((neededKWp * 1000) / 425); // 425W per panel
  const estimatedCost = panelCount * 850; // Simple heuristic cost including install
  
  return {
    neededKWp: parseFloat(neededKWp.toFixed(2)),
    panelCount,
    estimatedCost
  };
};
