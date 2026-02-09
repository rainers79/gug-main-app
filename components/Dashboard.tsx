
import React from 'react';
import { Users, Vote, Calendar, FileText, ArrowRight, Flame, Shield, TrendingUp } from 'lucide-react';
import { Role } from '../types';

interface DashboardProps {
  onNavigate: (id: string) => void;
  userRole: Role;
  isDarkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userRole, isDarkMode }) => {
  const stats = [
    { label: 'Mitglieder', value: '42', id: 'roles', icon: <Users className="w-4 h-4" /> },
    { label: 'Umfragen', value: '03', id: 'polls', icon: <Vote className="w-4 h-4" /> },
    { label: 'Termine', value: '05', id: 'calendar', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Budget', value: '1.2k', id: 'logic', icon: <FileText className="w-4 h-4" /> },
  ];

  const cardClasses = isDarkMode 
    ? "bg-[#1A1A1A] border-white/5 hover:border-[#B5A47A]/40 shadow-xl" 
    : "bg-white border-slate-200 hover:border-[#B5A47A]/30 shadow-sm";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Central Brand Identity */}
      <div className="flex flex-col items-center text-center space-y-8 pb-12 border-b border-white/5">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className={`absolute inset-0 border-[1px] ${isDarkMode ? 'border-[#B5A47A]/20' : 'border-[#B5A47A]/40'} rounded-full animate-spin-slow`} />
          <Flame className="w-8 h-8 text-[#B5A47A] drop-shadow-[0_0_15px_rgba(181,164,122,0.4)]" />
        </div>

        <div className="flex flex-col items-center px-4">
          <p className="font-header text-[6px] text-[#B5A47A] tracking-[1.2em] uppercase opacity-40 mb-4">SEKTION OST • COMMAND HQ</p>
          <h1 className={`font-header flex flex-col items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className="text-[50px] font-black tracking-[0.2em] leading-tight">GUG</span>
            <span className={`text-[10px] font-bold tracking-[0.6em] ${isDarkMode ? 'text-white/40' : 'text-slate-400'} whitespace-nowrap`}>GRILL UND GENUSS</span>
          </h1>
        </div>
      </div>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.id)}
            className={`p-6 rounded-[2rem] border flex flex-col items-center text-center group active:scale-95 transition-all ${cardClasses}`}
          >
            <div className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDarkMode ? 'bg-white/5 text-[#B5A47A] group-hover:bg-[#B5A47A] group-hover:text-black' : 'bg-slate-50 text-[#B5A47A] group-hover:bg-black group-hover:text-white'
            }`}>
              {stat.icon}
            </div>
            <p className={`text-[7px] font-black uppercase tracking-[0.3em] mb-1 ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
              {stat.label.split('').join(' ')}
            </p>
            <p className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {stat.value}
            </p>
          </button>
        ))}
      </div>

      {/* Main Action Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-10 rounded-[3rem] border relative overflow-hidden group active:scale-[0.99] transition-all ${isDarkMode ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center space-x-3 mb-8">
             <TrendingUp className="w-4 h-4 text-[#B5A47A]" />
             <p className="text-[#B5A47A] text-[8px] font-black tracking-[0.4em] uppercase">Core Intelligence</p>
          </div>
          
          <h3 className={`text-xl font-black mb-10 tracking-tight uppercase leading-snug ${isDarkMode ? 'text-white/95' : 'text-slate-900'}`}>
            Audit & Case<br/>Management
          </h3>
          
          <button 
            onClick={() => onNavigate('polls')}
            className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all ${
              isDarkMode ? 'bg-white text-black hover:bg-[#B5A47A]' : 'bg-black text-white hover:bg-[#B5A47A] hover:text-black'
            }`}
          >
            <span>Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className={`p-10 rounded-[3rem] border flex flex-col justify-between group transition-all ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
               <Shield className="w-4 h-4 text-[#B5A47A]" />
               <p className={`text-[8px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Secured Engine</p>
            </div>
            <p className={`text-[10px] leading-relaxed uppercase tracking-[0.1em] font-bold ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
              System-Validierung erfolgreich. Alle Transaktionen sind verschlüsselt protokolliert.
            </p>
          </div>
          
          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[7px] font-black text-[#B5A47A] uppercase tracking-[0.2em] mb-1">Node Status</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/80' : 'text-slate-800'}`}>Authenticated</span>
             </div>
             <div className="w-2 h-2 rounded-full bg-[#B5A47A] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
