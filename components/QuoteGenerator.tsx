
import React, { useEffect, useState } from 'react';
import { ClientProfile } from '../types';
import { calculateSolarSpecs } from '../utils';
import { getEnergyAnalysis } from '../geminiService';

interface QuoteGeneratorProps {
  profile: ClientProfile;
  onBack: () => void;
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ profile, onBack }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const specs = calculateSolarSpecs(profile.totalDailyKWh);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      const res = await getEnergyAnalysis(profile);
      setAnalysis(res || '');
      setLoading(false);
    };
    fetchAnalysis();
  }, [profile]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <button 
        onClick={onBack}
        className="no-print mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <i className="fa-solid fa-chevron-left"></i> Retour au tableau de bord
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 quote-container">
        {/* Header Section */}
        <div className="bg-slate-900 text-white p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-3">
                <i className="fa-solid fa-sun text-yellow-400"></i> SolarDevis Pro
              </h1>
              <p className="text-slate-400 mt-1">Expertise en Transition Énergétique</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold mb-1">DEVIS #SD-{Math.floor(Math.random() * 10000)}</h2>
              <p className="text-slate-400 text-sm">Date de visite: {profile.visitDate}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Client Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Informations Client</h3>
              <p className="text-lg font-bold text-slate-800">{profile.name}</p>
              <p className="text-slate-600 leading-relaxed mt-1">{profile.address}</p>
            </div>
            <div className="md:text-right">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Lieu de Chantier</h3>
              <p className="text-lg font-bold text-slate-800">{profile.siteName}</p>
              <p className="text-slate-600 mt-1">{profile.address}</p>
            </div>
          </div>

          {/* Table Header */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-blue-500"></i> Détail des Consommations
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="py-4 px-4 text-xs font-bold uppercase text-slate-500">Appareil</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase text-slate-500 text-center">Puissance (W)</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase text-slate-500 text-center">Utilisation (h/j)</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase text-slate-500 text-center">Qte</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase text-slate-500 text-right">Total (kWh/j)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-4 px-4 font-medium text-slate-800">{item.appareil}</td>
                      <td className="py-4 px-4 text-center text-slate-600">{item.puissanceMaxW} W</td>
                      <td className="py-4 px-4 text-center text-slate-600">{item.dureeHj} h</td>
                      <td className="py-4 px-4 text-center text-slate-600">x{item.quantite}</td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-800">
                        {(item.puissanceHoraireKWh * item.dureeHj * item.quantite).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="py-4 px-4 text-right font-bold text-blue-900 uppercase text-xs">Total Consommation Journalière</td>
                    <td className="py-4 px-4 text-right font-bold text-blue-900 text-lg">{profile.totalDailyKWh.toFixed(2)} kWh</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Proposed Solution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="text-green-600 text-xs font-bold uppercase mb-1">Dimensionnement</div>
              <div className="text-2xl font-bold text-green-900">{specs.neededKWp} kWc</div>
              <div className="text-sm text-green-700 mt-1">Puissance suggérée</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <div className="text-amber-600 text-xs font-bold uppercase mb-1">Nombre de Panneaux</div>
              <div className="text-2xl font-bold text-amber-900">{specs.panelCount} Unités</div>
              <div className="text-sm text-amber-700 mt-1">Type: 425W Monocristallin</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-5 text-white">
              <div className="text-slate-400 text-xs font-bold uppercase mb-1">Estimation Investissement</div>
              <div className="text-2xl font-bold text-white">{specs.estimatedCost.toLocaleString()} €</div>
              <div className="text-sm text-slate-300 mt-1">Pose et matériel inclus</div>
            </div>
          </div>

          {/* AI Analysis / Expert Opinion */}
          <div className="border-t border-slate-100 pt-8 no-print">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-microchip text-purple-600"></i> Analyse Experte par IA
            </h3>
            {loading ? (
              <div className="flex items-center gap-3 text-slate-500 py-4 animate-pulse">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Génération de l'analyse personnalisée...
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-6 text-slate-700 leading-relaxed prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }} />
              </div>
            )}
          </div>
        </div>
        
        {/* Footer actions */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center no-print">
          <p className="text-xs text-slate-400">SolarDevis Pro v1.0 • Devis non contractuel</p>
          <button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2"
          >
            <i className="fa-solid fa-print"></i> Imprimer le Devis
          </button>
        </div>
      </div>
    </div>
  );
};
