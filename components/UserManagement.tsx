
import React, { useState } from 'react';
import { User, Shield, ArrowUpCircle, CheckCircle, Crown, Search, UserMinus } from 'lucide-react';
import { Role } from '../types';

interface UserManagementProps {
  currentUserRole: Role;
  isDarkMode: boolean;
}

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  joined: string;
}

const INITIAL_USERS: ManagedUser[] = [
  { id: '1', name: 'Max Mustermann', email: 'max@gug.de', role: Role.VISITOR, joined: '12.02.2025' },
  { id: '2', name: 'Sabine Grill', email: 'sabine@gug.de', role: Role.USER, joined: '05.01.2025' },
  { id: '3', name: 'Thomas Vorstand', email: 'thomas@gug.de', role: Role.VORSTAND, joined: '20.12.2024' },
];

export const UserManagement: React.FC<UserManagementProps> = ({ currentUserRole, isDarkMode }) => {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');

  const isSuperAdmin = currentUserRole === Role.SUPERADMIN;
  const isAdmin = currentUserRole === Role.ADMIN || isSuperAdmin;

  const promoteUser = (userId: string, newRole: Role) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Benutzer-Pool</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B5A47A] mt-2">Berechtigungs-Eskalation</p>
        </div>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
          <input 
            type="text" 
            placeholder="Name oder E-Mail suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full md:w-80 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold outline-none border transition-all ${
              isDarkMode ? 'bg-white/5 border-white/10 focus:border-[#B5A47A]' : 'bg-white border-slate-200'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className={`p-8 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:scale-[1.01] ${
            isDarkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <div className="flex items-center space-x-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
              }`}>
                <User className="w-8 h-8 text-[#B5A47A]/40" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-black uppercase tracking-tight">{user.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em] border ${
                    user.role === Role.SUPERADMIN ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                    user.role === Role.ADMIN ? 'bg-[#B5A47A]/10 text-[#B5A47A] border-[#B5A47A]/20' :
                    'bg-slate-500/10 text-slate-500 border-slate-500/20'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-[10px] opacity-30 font-bold mt-1 uppercase tracking-widest">{user.email} • Seit {user.joined}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* ADMIN Promotion Logic */}
              {isAdmin && user.role === Role.VISITOR && (
                <>
                  <button 
                    onClick={() => promoteUser(user.id, Role.USER)}
                    className="px-6 py-3 bg-[#B5A47A]/10 text-[#B5A47A] text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#B5A47A] hover:text-black transition-all"
                  >
                    Als Mitglied zulassen
                  </button>
                  <button 
                    onClick={() => promoteUser(user.id, Role.VORSTAND)}
                    className="px-6 py-3 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all"
                  >
                    Vorstand
                  </button>
                </>
              )}

              {/* SUPERADMIN Promotion Logic */}
              {isSuperAdmin && user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN && (
                <button 
                  onClick={() => promoteUser(user.id, Role.ADMIN)}
                  className="px-6 py-3 bg-[#B5A47A] text-black text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all flex items-center space-x-2"
                >
                  <Crown className="w-3 h-3" />
                  <span>Admin ernennen</span>
                </button>
              )}

              <button className="p-4 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all opacity-20 hover:opacity-100">
                <UserMinus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-10 rounded-[3.5rem] border ${isDarkMode ? 'bg-[#050505] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-start space-x-6">
          <Shield className="w-6 h-6 text-[#B5A47A] shrink-0" />
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest">Richtlinien zur Beförderung</h5>
            <ul className="text-[9px] uppercase tracking-widest leading-relaxed opacity-40 space-y-2">
              <li>• Besucher haben nach Registrierung nur Lesezugriff.</li>
              <li>• Admins können Besucher zu Mitgliedern oder Vorständen erheben.</li>
              <li>• Nur Superadmins können neue Admins für die Sektion ernennen.</li>
              <li>• Jede Rollenänderung wird im Audit-Log revisionssicher gespeichert.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
