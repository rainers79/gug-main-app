
import React, { useState } from 'react';
import { NAVIGATION_ITEMS } from './constants';
import { Dashboard } from './components/Dashboard';
import { SpecContent } from './components/SpecContent';
import { RolesMatrix } from './components/RolesMatrix';
import { InteractiveDemo } from './components/InteractiveDemo';
import { DataModelView } from './components/DataModelView';
import { PollSimulator } from './components/PollSimulator';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { UserManagement } from './components/UserManagement';
import { AuthView } from './components/AuthView';
import { Menu, ChevronDown, Flame, LogOut } from 'lucide-react';
import { Role } from './types';

export interface Poll {
  id: string;
  question: string;
  options: any[];
  totalVotes: number;
  hasVoted: boolean;
  targetGroups: Role[];
  targetUserIds: string[];
  isAllTargeted: boolean;
  votedUserIds: string[]; 
  tasks: any[];
  messages: any[];
  createdAt: string;
  eventDate?: string;
  eventTime?: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name: string, role: Role} | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Benachrichtigungs-Einstellungen
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');

  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      question: 'Wann soll das nächste Grillfest stattfinden?',
      options: [
        { id: 'a', text: 'Samstag, 12. Juli', votes: 12 },
        { id: 'b', text: 'Sonntag, 13. Juli', votes: 8 },
        { id: 'c', text: 'Samstag, 19. Juli', votes: 15 },
      ],
      totalVotes: 35,
      hasVoted: false,
      targetGroups: [Role.ADMIN, Role.VORSTAND, Role.USER, Role.SUPERADMIN],
      targetUserIds: [],
      isAllTargeted: true,
      votedUserIds: ['u1', 'u2', 'u3'],
      tasks: [
        { id: 't1', title: 'Grillkohle besorgen', assignedUserId: 'u2', status: 'OPEN' }
      ],
      messages: [
        { id: 'm1', senderId: 'u2', senderName: 'Sabine Maier', text: 'Freue mich schon!', timestamp: '14:05' }
      ],
      createdAt: '20. Mai 2024',
      eventDate: '2024-07-19',
      eventTime: '17:00'
    }
  ]);

  const handleLogin = (user: { name: string; role: Role }) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('overview');
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Dashboard onNavigate={setActiveTab} userRole={currentUser?.role || Role.VISITOR} isDarkMode={isDarkMode} />;
      case 'calendar': return <CalendarView polls={polls} setPolls={setPolls} userRole={currentUser?.role || Role.VISITOR} onNavigateToCase={(id) => { setActiveTab('polls'); }} isDarkMode={isDarkMode} />;
      case 'polls': return <PollSimulator userRole={currentUser?.role || Role.VISITOR} polls={polls} setPolls={setPolls} isDarkMode={isDarkMode} />;
      case 'members': return <UserManagement currentUserRole={currentUser?.role || Role.VISITOR} isDarkMode={isDarkMode} />;
      case 'spec': return <SpecContent isDarkMode={isDarkMode} />;
      case 'roles': return <RolesMatrix isDarkMode={isDarkMode} />;
      case 'logic': return <InteractiveDemo userRole={currentUser?.role || Role.VISITOR} isDarkMode={isDarkMode} />;
      case 'data': return <DataModelView isDarkMode={isDarkMode} />;
      case 'settings': return (
        <SettingsView 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          quietHoursEnabled={quietHoursEnabled}
          setQuietHoursEnabled={setQuietHoursEnabled}
          quietHoursStart={quietHoursStart}
          setQuietHoursStart={setQuietHoursStart}
          quietHoursEnd={quietHoursEnd}
          setQuietHoursEnd={setQuietHoursEnd}
        />
      );
      default: return <Dashboard onNavigate={setActiveTab} userRole={currentUser?.role || Role.VISITOR} isDarkMode={isDarkMode} />;
    }
  };

  // Filterung der Navigation basierend auf der Rolle des Nutzers
  const filteredNav = NAVIGATION_ITEMS.filter(item => {
    if (!currentUser) return false;
    // Prüfe, ob die Rolle des Nutzers im allowedRoles Array des Items enthalten ist
    return item.allowedRoles.includes(currentUser.role);
  });

  const activeLabel = NAVIGATION_ITEMS.find(i => i.id === activeTab)?.label || '';

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 font-sans selection:bg-[#B5A47A]/30 ${isDarkMode ? 'dark bg-black text-white' : 'light bg-[#F8F8F8] text-[#1A1A1A]'}`}>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDarkMode ? 'bg-[#080808] border-white/5' : 'bg-white border-slate-200'}
      `}>
        <div className={`p-8 flex flex-col items-center border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
          <div className={`w-12 h-12 mb-4 border rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? 'border-[#B5A47A]/20 bg-white/5' : 'border-[#B5A47A]/40 bg-white'}`}>
             <Flame className="w-4 h-4 text-[#B5A47A]" />
          </div>
          <h1 className={`font-header text-[6px] tracking-[0.4em] uppercase ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>MASTER NODE</h1>
        </div>
        
        <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-5 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-[#B5A47A] text-black font-bold' 
                  : isDarkMode ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-[#B5A47A] hover:bg-slate-50'
              }`}
            >
              <span className="shrink-0 scale-90">{item.icon}</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.1em] whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-tight truncate">{currentUser?.name}</p>
              <p className="text-[8px] font-bold uppercase text-[#B5A47A] tracking-widest">{currentUser?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-white/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={`h-14 backdrop-blur-2xl border-b px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-colors ${
          isDarkMode ? 'bg-black/90 border-white/5' : 'bg-white/90 border-slate-200'
        }`}>
          <button onClick={() => setIsSidebarOpen(true)} className={`p-2.5 rounded-lg md:hidden active:scale-90 transition-transform ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
            <Menu className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`} />
          </button>
          
          <h2 className={`font-header text-[9px] font-black tracking-[0.8em] uppercase whitespace-nowrap overflow-hidden text-center flex-1 mx-4 ${isDarkMode ? 'text-white/90' : 'text-slate-900'}`}>
            {activeLabel.split('').join(' ')}
          </h2>
          
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-lg border flex items-center justify-center text-[8px] font-black uppercase shadow-inner transition-colors ${
               isDarkMode ? 'bg-[#B5A47A]/10 border-[#B5A47A]/20 text-[#B5A47A]' : 'bg-white border-slate-200 text-slate-400'
             }">
                {currentUser?.role.substring(0,2)}
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
