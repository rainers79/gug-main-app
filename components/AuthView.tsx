
import React, { useState, useEffect } from 'react';
import { Flame, Shield, User, Mail, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Role } from '../types';

interface AuthViewProps {
  onLogin: (user: { name: string; role: Role }) => void;
  isDarkMode: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, isDarkMode }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaQuest, setCaptchaQuest] = useState({ a: 0, b: 0, sum: 0 });
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuest({ a, b, sum: a + b });
    setCaptchaValue('');
  };

  useEffect(() => {
    generateCaptcha();
  }, [isRegister]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (parseInt(captchaValue) !== captchaQuest.sum) {
        setError('Captcha falsch. Bitte erneut versuchen.');
        generateCaptcha();
        return;
      }
      onLogin({ name, role: Role.VISITOR });
    } else {
      if (email === 'admin@gug.de') {
        onLogin({ name: 'System Admin', role: Role.SUPERADMIN });
      } else {
        onLogin({ name: email.split('@')[0], role: Role.USER });
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 transition-colors duration-700 ${isDarkMode ? 'bg-black' : 'bg-[#F3F4F6]'}`}>
      <div className="max-w-md w-full space-y-12 animate-in fade-in zoom-in-95 duration-1000">
        
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className={`absolute inset-0 border rounded-full animate-spin-slow ${isDarkMode ? 'border-[#B5A47A]/20' : 'border-[#B5A47A]/30'}`} />
            <Flame className="w-10 h-10 text-[#B5A47A] drop-shadow-[0_0_15px_rgba(181,164,122,0.4)]" />
          </div>
          <div className="space-y-2">
            <h1 className={`font-header text-4xl font-bold tracking-[0.2em] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GUG</h1>
            <p className="font-header text-[8px] tracking-[0.6em] text-[#B5A47A] uppercase">Sektion Ost • Mobile HQ</p>
          </div>
        </div>

        <div className={`p-10 rounded-[3rem] border shadow-2xl backdrop-blur-xl transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="flex mb-10 p-1 bg-white/5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${!isRegister ? 'bg-[#B5A47A] text-black' : 'text-white/40'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${isRegister ? 'bg-[#B5A47A] text-black' : 'text-white/40'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest opacity-40 ml-4">Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5A47A]/40" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#B5A47A] transition-all text-sm font-bold"
                    placeholder="Dein Name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase tracking-widest opacity-40 ml-4">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5A47A]/40" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#B5A47A] transition-all text-sm font-bold"
                  placeholder="name@gug.de"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase tracking-widest opacity-40 ml-4">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5A47A]/40" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#B5A47A] transition-all text-sm font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-4 p-6 bg-white/5 rounded-[2rem] border border-white/5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Human Check</span>
                  <Shield className="w-3 h-3 text-[#B5A47A]" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-black text-[#B5A47A]">{captchaQuest.a} + {captchaQuest.b} =</div>
                  <input 
                    type="number" 
                    required
                    value={captchaValue}
                    onChange={e => setCaptchaValue(e.target.value)}
                    className="w-20 bg-white/10 border border-white/20 rounded-xl py-3 text-center outline-none focus:border-[#B5A47A] text-lg font-black"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#B5A47A] text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all mt-8"
            >
              {isRegister ? 'Account erstellen' : 'Login'}
            </button>
          </form>
        </div>

        <p className={`text-center text-[7px] font-black uppercase tracking-[0.5em] opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GUG SECURE NODE v2025.04</p>
      </div>
    </div>
  );
};
