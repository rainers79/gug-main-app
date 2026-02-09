
import React from 'react';
import { Shield, Check, X, Lock, Crown } from 'lucide-react';

export const RolesMatrix: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const permissions = [
    { name: 'Admin Management', desc: 'Admins ernennen', roles: [true, false, false, false, false] },
    { name: 'User Management', desc: 'Sperren/Freischalten', roles: [true, true, false, false, false] },
    { name: 'Rollen-Zuweisung', desc: 'Rechte ändern', roles: [true, true, false, false, false] },
    { name: 'Umfragen', desc: 'Neu anlegen', roles: [true, true, true, false, false] },
    { name: 'Tasks', desc: 'Zuweisen', roles: [true, true, true, false, false] },
    { name: 'Abstimmen', desc: 'Teilnahme', roles: [true, true, true, true, false] },
    { name: 'Beleg-Upload', desc: 'Einreichung', roles: [true, true, true, true, false] },
    { name: 'App View', desc: 'Lesezugriff', roles: [true, true, true, true, true] },
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-12">
      <div className="mb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight">Rollen-Hierarchie</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B5A47A] mt-2">RBAC Definition Sektion Ost</p>
      </div>

      <div className="relative overflow-x-auto rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-sm">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="p-8 text-[9px] font-black uppercase tracking-widest opacity-40">Funktion</th>
              <th className="p-8 text-center text-[9px] font-black uppercase tracking-widest text-purple-400">SuA</th>
              <th className="p-8 text-center text-[9px] font-black uppercase tracking-widest text-[#B5A47A]">Adm</th>
              <th className="p-8 text-center text-[9px] font-black uppercase tracking-widest opacity-60">Vor</th>
              <th className="p-8 text-center text-[9px] font-black uppercase tracking-widest opacity-40">Usr</th>
              <th className="p-8 text-center text-[9px] font-black uppercase tracking-widest opacity-20">Vis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {permissions.map((p, i) => (
              <tr key={i} className="hover:bg-white/5 transition-all group">
                <td className="p-8">
                  <p className="text-sm font-black uppercase tracking-widest">{p.name}</p>
                  <p className="text-[9px] opacity-30 font-bold mt-1 uppercase tracking-tighter">{p.desc}</p>
                </td>
                {p.roles.map((hasAccess, ri) => (
                  <td key={ri} className="p-8 text-center">
                    <div className="flex justify-center">
                      {hasAccess ? (
                        <div className={`p-2 rounded-lg ${ri === 0 ? 'bg-purple-500/10 text-purple-400' : 'bg-[#B5A47A]/10 text-[#B5A47A]'}`}>
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="opacity-5">
                          <X className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[3rem] border border-white/5 bg-white/5 flex items-start space-x-6">
          <Crown className="w-6 h-6 text-purple-400 shrink-0" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Superadmin Privilegien</h4>
            <p className="text-[9px] opacity-40 leading-relaxed uppercase tracking-widest">
              Kann als einziger Rollen-Rang andere Mitglieder in den Status "Admin" versetzen.
            </p>
          </div>
        </div>
        <div className="p-8 rounded-[3rem] border border-white/5 bg-white/5 flex items-start space-x-6">
          <Lock className="w-6 h-6 text-[#B5A47A] shrink-0" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Visitor Restriktion</h4>
            <p className="text-[9px] opacity-40 leading-relaxed uppercase tracking-widest">
              Besucher sind neu registrierte Nutzer. Sie benötigen die manuelle Validierung durch einen Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
