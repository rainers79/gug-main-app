
import React from 'react';
import { Moon, Sun, Smartphone, Bell, BellOff, Shield, Info, ChevronRight, Clock } from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
  quietHoursEnabled: boolean;
  setQuietHoursEnabled: (val: boolean) => void;
  quietHoursStart: string;
  setQuietHoursStart: (val: string) => void;
  quietHoursEnd: string;
  setQuietHoursEnd: (val: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  isDarkMode, 
  setIsDarkMode,
  notificationsEnabled,
  setNotificationsEnabled,
  quietHoursEnabled,
  setQuietHoursEnabled,
  quietHoursStart,
  setQuietHoursStart,
  quietHoursEnd,
  setQuietHoursEnd
}) => {
  const SettingItem: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    desc: string; 
    action?: React.ReactNode; 
    disabled?: boolean;
    onClick?: () => void 
  }> = ({ icon, title, desc, action, disabled, onClick }) => (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`p-6 rounded-[2rem] border flex items-center justify-between group transition-all ${
        disabled ? 'opacity-30 grayscale cursor-not-allowed' : ''
      } ${
        isDarkMode 
          ? 'bg-[#0A0A0A] border-white/5 hover:border-[#B5A47A]/30' 
          : 'bg-white border-slate-200 hover:border-[#B5A47A]/40 shadow-sm'
      } ${onClick && !disabled ? 'cursor-pointer active:scale-[0.98]' : ''}`}
    >
      <div className="flex items-center space-x-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          isDarkMode ? 'bg-white/5 text-[#B5A47A]' : 'bg-slate-50 text-[#B5A47A]'
        }`}>
          {icon}
        </div>
        <div>
          <h4 className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>{title}</h4>
          <p className={`text-[9px] uppercase tracking-wider font-semibold opacity-40 mt-1`}>{desc}</p>
        </div>
      </div>
      {action ? action : <ChevronRight className="w-4 h-4 opacity-20" />}
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Design Bereich */}
      <div className="space-y-4">
        <p className="text-[#B5A47A] text-[7px] font-black uppercase tracking-[0.5em] px-4">Erscheinungsbild</p>
        <SettingItem 
          icon={isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          title="Dunkelmodus"
          desc={isDarkMode ? "Reduziert Augenbelastung" : "Klares, helles Design"}
          action={
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isDarkMode ? 'bg-[#B5A47A]' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
            </button>
          }
        />
      </div>

      {/* Benachrichtigungs Bereich */}
      <div className="space-y-4">
        <p className="text-[#B5A47A] text-[7px] font-black uppercase tracking-[0.5em] px-4">Interaktion</p>
        <SettingItem 
          icon={notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          title="Popups & Mitteilungen"
          desc={notificationsEnabled ? "Alle Signale aktiv" : "Vollständig stummgeschaltet"}
          action={
            <button 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${notificationsEnabled ? 'bg-[#B5A47A]' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
            </button>
          }
        />

        <div className={`space-y-3 transition-all duration-500 ${!notificationsEnabled ? 'pointer-events-none' : ''}`}>
          <SettingItem 
            disabled={!notificationsEnabled}
            icon={<Clock className="w-5 h-5" />}
            title="Ruhemodus (DND)"
            desc="Zeitgesteuerte Stummschaltung"
            action={
              <button 
                onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${quietHoursEnabled ? 'bg-[#B5A47A]' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${quietHoursEnabled ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
              </button>
            }
          />
          
          {quietHoursEnabled && notificationsEnabled && (
            <div className={`p-6 rounded-[2rem] border animate-in slide-in-from-top-2 duration-300 ${
              isDarkMode ? 'bg-[#0F0F0F] border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <label className="text-[7px] font-black uppercase tracking-[0.3em] opacity-50 block">Von</label>
                  <input 
                    type="time" 
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                    className={`w-full bg-transparent border-b text-xs font-bold outline-none py-1 ${
                      isDarkMode ? 'border-white/10 text-white' : 'border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div className="px-6 text-[#B5A47A] opacity-30">—</div>
                <div className="flex-1 space-y-2">
                  <label className="text-[7px] font-black uppercase tracking-[0.3em] opacity-50 block">Bis</label>
                  <input 
                    type="time" 
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                    className={`w-full bg-transparent border-b text-xs font-bold outline-none py-1 ${
                      isDarkMode ? 'border-white/10 text-white' : 'border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
              <p className="text-[8px] font-medium opacity-30 mt-4 uppercase tracking-widest text-center">
                In diesem Zeitraum bimmelt nichts.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 opacity-50">
        <p className={`text-[7px] font-black uppercase tracking-[0.5em] px-4 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>System</p>
        <SettingItem 
          icon={<Smartphone className="w-5 h-5" />}
          title="Offline Modus"
          desc="Daten lokal zwischenspeichern"
        />
        <SettingItem 
          icon={<Shield className="w-5 h-5" />}
          title="Datenschutz"
          desc="Berechtigungen & Audit-Logs"
        />
      </div>

      <div className="space-y-4">
        <p className={`text-[7px] font-black uppercase tracking-[0.5em] px-4 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Support</p>
        <SettingItem 
          icon={<Info className="w-5 h-5" />}
          title="Versions-Info"
          desc="Build 2025.04.1-Stable"
        />
      </div>

      <footer className="text-center pt-10">
         <p className={`text-[6px] uppercase tracking-[1.8em] whitespace-nowrap ${isDarkMode ? 'text-white/10' : 'text-slate-300'}`}>GUG ADVANCED SETTINGS • ENCRYPTED</p>
      </footer>
    </div>
  );
};
