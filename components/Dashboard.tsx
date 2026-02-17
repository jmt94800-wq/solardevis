
import React from 'react';
import { ClientProfile } from '../types';

interface DashboardProps {
  profiles: ClientProfile[];
  onSelect: (p: ClientProfile) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profiles, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile, idx) => (
        <div 
          key={idx}
          onClick={() => onSelect(profile)}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {profile.name}
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <i className="fa-solid fa-location-dot"></i> {profile.siteName}
              </p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              {profile.items.length} appareils
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Conso Journalière</span>
              <span className="font-semibold">{profile.totalDailyKWh.toFixed(2)} kWh</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Puissance Max</span>
              <span className="font-semibold text-orange-600">{profile.totalMaxW} W</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">Visite le {profile.visitDate}</span>
              <span className="text-blue-600 text-sm font-medium">Générer devis <i className="fa-solid fa-arrow-right ml-1"></i></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
