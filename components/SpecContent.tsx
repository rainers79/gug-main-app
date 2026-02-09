
import React from 'react';
import { CheckCircle2, AlertCircle, Info, Database, Layers, ShieldCheck, Zap } from 'lucide-react';

const Section: React.FC<{ title: string; id: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, id, children, icon }) => (
  <section id={id} className="mb-6 md:mb-12 bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm scroll-mt-20">
    <div className="flex items-center space-x-3 mb-4 md:mb-6 border-b border-slate-100 pb-3 md:pb-4">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
        {icon}
      </div>
      <h2 className="text-lg md:text-2xl font-bold text-slate-800 truncate">{title}</h2>
    </div>
    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm md:text-base">
      {children}
    </div>
  </section>
);

// Added props interface for isDarkMode
export const SpecContent: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8">
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-2">Projekt-Spezifikation</h1>
        <p className="text-sm md:text-lg text-slate-500">Guide für die modulare GUG Vereins-App.</p>
      </div>

      <Section title="1) MVP Scope" id="mvp" icon={<Layers className="w-5 h-5 md:w-6 md:h-6" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-blue-700 font-bold mb-2 flex items-center text-sm md:text-base">
              <CheckCircle2 className="w-4 h-4 mr-2" /> MVP (Phase 1)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
              <li>OIDC Auth-System</li>
              <li>Rollenverwaltung</li>
              <li>Umfragen -> Cases</li>
              <li>Task Management</li>
              <li>Push Reminders</li>
              <li>Finanz-Modul</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <h4 className="text-slate-700 font-bold mb-2 flex items-center text-sm md:text-base">
              <Zap className="w-4 h-4 mr-2" /> Extensions
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
              <li>Bonier-App</li>
              <li>Lagerverwaltung</li>
              <li>SEPA Billing</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="2) Architektur" id="arch" icon={<Layers className="w-5 h-5 md:w-6 md:h-6" />}>
        <p className="mb-4 text-xs md:text-sm">API-first Architektur mit JWT/SSO Support für Multi-App Umgebungen.</p>
        <div className="bg-slate-900 text-blue-300 p-4 rounded-xl font-mono text-[9px] md:text-xs overflow-x-auto whitespace-pre">
{`[ Clients: Mobile/Web ]
       ↓ (REST/WS)
[ Central Backend API ]
       ↓
[ Core | Finance | Auth ]`}
        </div>
      </Section>

      <Section title="3) Rollenmatrix" id="roles" icon={<ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />}>
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="min-w-full text-[10px] md:text-xs text-left">
            <thead className="bg-slate-50 font-bold">
              <tr>
                <th className="p-2 md:p-3 border-b">Funktion</th>
                <th className="p-2 md:p-3 border-b text-center">Adm</th>
                <th className="p-2 md:p-3 border-b text-center">Vor</th>
                <th className="p-2 md:p-3 border-b text-center">Usr</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 md:p-3 border-b">Nutzer freigeben</td><td className="p-2 md:p-3 border-b text-center">✅</td><td className="p-2 md:p-3 border-b text-center">❌</td><td className="p-2 md:p-3 border-b text-center">❌</td></tr>
              <tr><td className="p-2 md:p-3 border-b">Tasks anlegen</td><td className="p-2 md:p-3 border-b text-center">✅</td><td className="p-2 md:p-3 border-b text-center">✅</td><td className="p-2 md:p-3 border-b text-center">❌</td></tr>
              <tr><td className="p-2 md:p-3 border-b">Belege laden</td><td className="p-2 md:p-3 border-b text-center">✅</td><td className="p-2 md:p-3 border-b text-center">✅</td><td className="p-2 md:p-3 border-b text-center">✅</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="5) Datenmodell" id="data" icon={<Database className="w-5 h-5 md:w-6 md:h-6" />}>
        <div className="space-y-2 text-xs md:text-sm font-mono bg-slate-50 p-4 rounded-xl">
          <div><span className="text-blue-600 font-bold">User:</span> id, role, pos_ready</div>
          <div><span className="text-emerald-600 font-bold">Case:</span> id, poll_id, logs</div>
          <div><span className="text-amber-600 font-bold">Receipt:</span> id, user_id, amount</div>
        </div>
      </Section>

      <Section title="9) Security" id="security" icon={<ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />}>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 text-xs md:text-sm bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-900 leading-tight"><strong>Audit-Log:</strong> Jede Stimmabgabe und jeder Beleg-Upload ist unveränderbar protokolliert.</p>
          </div>
          <div className="flex items-start space-x-3 text-xs md:text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-blue-900 leading-tight"><strong>DSGVO:</strong> Exportfunktion für alle personenbezogenen Daten im Profil.</p>
          </div>
        </div>
      </Section>
    </div>
  );
};
