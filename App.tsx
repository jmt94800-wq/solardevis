
import React, { useState, useRef } from 'react';
import { ProspectEntry, ClientProfile } from './types';
import { parseCSV, groupByClient } from './utils';
import { Dashboard } from './components/Dashboard';
import { QuoteGenerator } from './components/QuoteGenerator';

const App: React.FC = () => {
  const [entries, setEntries] = useState<ProspectEntry[]>([]);
  const [profiles, setProfiles] = useState<ClientProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ClientProfile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      setEntries(parsed);
      setProfiles(groupByClient(parsed));
    };
    reader.readAsText(file);
  };

  const clearData = () => {
    setEntries([]);
    setProfiles([]);
    setSelectedProfile(null);
  };

  if (selectedProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <QuoteGenerator 
          profile={selectedProfile} 
          onBack={() => setSelectedProfile(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fa-solid fa-sun text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">SolarDevis <span className="text-blue-600">Pro</span></h1>
        </div>
        {profiles.length > 0 && (
          <button 
            onClick={clearData}
            className="text-sm font-medium text-red-500 hover:text-red-600 px-4 py-2"
          >
            Effacer les données
          </button>
        )}
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">
        {profiles.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-20 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-file-csv text-4xl"></i>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Générez vos devis instantanément</h2>
              <p className="text-slate-600 text-lg">
                Importez votre fichier d'audit énergétique (CSV ou Excel) pour créer des propositions photovoltaïques professionnelles.
              </p>
            </div>

            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (re) => {
                    const parsed = parseCSV(re.target?.result as string);
                    setEntries(parsed);
                    setProfiles(groupByClient(parsed));
                  };
                  reader.readAsText(file);
                }
              }}
              className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer bg-white
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv"
                className="hidden" 
              />
              <div className="flex flex-col items-center gap-4">
                <i className="fa-solid fa-cloud-arrow-up text-5xl text-slate-300"></i>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-700">Cliquez ou glissez-déposez votre fichier</p>
                  <p className="text-sm text-slate-400">Supporte le format .csv (séparateur point-virgule)</p>
                </div>
                <div className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200">
                  Sélectionner un fichier
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex gap-4">
                <div className="text-blue-500 mt-1"><i className="fa-solid fa-bolt"></i></div>
                <div>
                  <h4 className="font-bold text-slate-800">Calcul Automatique</h4>
                  <p className="text-sm text-slate-500">Puissance max, conso journalière et dimensionnement kWc.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-blue-500 mt-1"><i className="fa-solid fa-robot"></i></div>
                <div>
                  <h4 className="font-bold text-slate-800">Analyse IA</h4>
                  <p className="text-sm text-slate-500">Recommandations expertes générées par intelligence artificielle.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-blue-500 mt-1"><i className="fa-solid fa-file-pdf"></i></div>
                <div>
                  <h4 className="font-bold text-slate-800">Prêt à l'Emploi</h4>
                  <p className="text-sm text-slate-500">Génération de documents PDF propres pour vos clients.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Clients Détectés</h2>
                <p className="text-slate-500">Sélectionnez un projet pour générer le devis détaillé.</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> Importer un autre fichier
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
              </button>
            </div>
            
            <Dashboard 
              profiles={profiles} 
              onSelect={(p) => setSelectedProfile(p)} 
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; 2024 SolarDevis Pro. Conçu pour les experts du photovoltaïque.</p>
      </footer>
    </div>
  );
};

export default App;
