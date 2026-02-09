
import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, Info, Plus, X, CheckSquare, Target, CalendarDays, ListFilter, Sparkles, LayoutGrid } from 'lucide-react';
import { Poll } from '../App';
import { Role } from '../types';

interface CalendarViewProps {
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  onNavigateToCase: (id: string) => void;
  userRole: Role;
  isDarkMode: boolean;
}

type ViewMode = 'year' | 'month' | 'day';

// Dynamisches Farbschema für verschiedene Termine
const EVENT_COLORS = [
  '#B5A47A', // Gold
  '#8E442D', // Rust
  '#2D8E6B', // Emerald
  '#2D6B8E', // Ocean
  '#6B2D8E', // Violet
  '#E67E22', // Orange
  '#E74C3C', // Alizarin
  '#1ABC9C', // Turquoise
];

export const CalendarView: React.FC<CalendarViewProps> = ({ polls, setPolls, onNavigateToCase, userRole, isDarkMode }) => {
  const isAdminOrVorstand = userRole === Role.ADMIN || userRole === Role.VORSTAND;
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [hoveredDateKey, setHoveredDateKey] = useState<string | null>(null);
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['Ja', 'Nein']);
  const [newTime, setNewTime] = useState('12:00');

  const eventsByDate = useMemo(() => {
    const map: Record<string, Poll[]> = {};
    polls.forEach(p => {
      if (p.eventDate) {
        if (!map[p.eventDate]) map[p.eventDate] = [];
        map[p.eventDate].push(p);
      }
    });
    return map;
  }, [polls]);

  const changeMonth = (offset: number) => {
    const next = new Date(currentDate);
    next.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(next);
  };

  const changeYear = (offset: number) => {
    const next = new Date(currentDate);
    next.setFullYear(currentDate.getFullYear() + offset);
    setCurrentDate(next);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const formatISO = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  const handleCreateInCalendar = () => {
    if (!selectedDay || !newQuestion || newOptions.filter(o => o.trim() !== '').length < 2) return;
    
    const validOptions = newOptions.filter(opt => opt.trim() !== '');
    const pollId = Date.now().toString();
    const newPoll: Poll = {
      id: pollId,
      question: newQuestion,
      options: validOptions.map((text, i) => ({
        id: `opt-${i}-${Date.now()}`,
        text: text,
        votes: 0
      })),
      totalVotes: 0,
      hasVoted: false,
      targetGroups: [Role.ADMIN, Role.VORSTAND, Role.USER],
      targetUserIds: [],
      isAllTargeted: true,
      votedUserIds: [],
      tasks: [],
      messages: [],
      createdAt: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
      eventDate: formatISO(selectedDay),
      eventTime: newTime
    };

    setPolls([newPoll, ...polls]);
    setNewQuestion('');
    setNewOptions(['Ja', 'Nein']);
    setShowQuickCreate(false);
  };

  const renderYearView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-700">
      {monthNames.map((month, idx) => {
        const year = currentDate.getFullYear();
        const monthDates = Object.keys(eventsByDate).filter(dateStr => {
          const d = new Date(dateStr);
          return d.getMonth() === idx && d.getFullYear() === year;
        });
        
        const monthEvents = monthDates.flatMap(date => eventsByDate[date]);

        return (
          <button
            key={month}
            onClick={() => {
              const next = new Date(currentDate);
              next.setMonth(idx);
              setCurrentDate(next);
              setViewMode('month');
            }}
            className={`p-6 rounded-[2.5rem] transition-all text-left flex flex-col justify-between h-52 group border relative overflow-hidden ${
              monthEvents.length > 0 
              ? isDarkMode ? 'bg-[#121212] border-[#B5A47A]/30' : 'bg-white border-[#B5A47A]/40 shadow-sm' 
              : isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start z-10">
              <h3 className={`font-black text-[10px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>{month}</h3>
              {monthEvents.length > 0 && (
                <span className="bg-[#B5A47A] text-black text-[8px] font-black px-2 py-1 rounded-full shadow-lg">{monthEvents.length}</span>
              )}
            </div>
            
            <div className="space-y-3 z-10">
              {/* Event-Grid in der Jahresansicht */}
              <div className="flex flex-wrap gap-1.5 max-w-full">
                {monthEvents.slice(0, 18).map((ev, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 rounded-full shadow-sm" 
                    style={{ backgroundColor: EVENT_COLORS[i % EVENT_COLORS.length] }} 
                  />
                ))}
                {monthEvents.length > 18 && (
                   <span className="text-[7px] font-black opacity-30">+{monthEvents.length - 18}</span>
                )}
              </div>
              <p className={`text-[8px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
                {monthEvents.length > 0 ? `${monthEvents.length} Ereignisse` : 'Keine Einträge'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));

    return (
      <div className={`rounded-[3.5rem] overflow-hidden border transition-colors shadow-2xl animate-in fade-in duration-700 ${
        isDarkMode ? 'bg-[#080808] border-white/5' : 'bg-white border-slate-200'
      }`}>
        <div className={`grid grid-cols-7 border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className={`py-6 text-center text-[8px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 relative">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className={`aspect-square md:h-36 ${isDarkMode ? 'bg-white/[0.02]' : 'bg-slate-50/50'}`} />;
            
            const dateKey = formatISO(day);
            const dayEvents = eventsByDate[dateKey] || [];
            const isSelected = selectedDay && formatISO(selectedDay) === dateKey;
            const isHovered = hoveredDateKey === dateKey;
            const today = isToday(day);

            return (
              <div 
                key={dateKey} 
                onClick={() => { setSelectedDay(day); setViewMode('day'); }}
                onMouseEnter={() => setHoveredDateKey(dateKey)}
                onMouseLeave={() => setHoveredDateKey(null)}
                className={`aspect-square md:h-36 p-4 md:p-6 relative cursor-pointer transition-all border-r border-b group ${
                  isDarkMode ? 'border-white/5' : 'border-slate-100'
                } ${isSelected ? (isDarkMode ? 'bg-[#151515]' : 'bg-slate-50') : 'hover:bg-[#B5A47A]/10'}`}
              >
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] md:text-sm font-black w-6 h-6 md:w-9 md:h-9 flex items-center justify-center rounded-xl transition-all ${
                      today 
                        ? 'bg-[#B5A47A] text-black shadow-lg shadow-[#B5A47A]/30' 
                        : isDarkMode ? 'text-white/80 bg-white/5' : 'text-slate-700 bg-slate-50'
                    }`}>
                      {day.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex -space-x-1.5">
                        {dayEvents.slice(0, 3).map((_, i) => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full ring-1 ring-black" style={{ backgroundColor: EVENT_COLORS[i % EVENT_COLORS.length] }} />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto flex flex-wrap gap-1 md:gap-1.5">
                    {dayEvents.map((event, i) => (
                      <div 
                        key={event.id}
                        className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full shadow-sm transition-transform group-hover:scale-125`}
                        style={{ backgroundColor: EVENT_COLORS[i % EVENT_COLORS.length] }}
                      />
                    ))}
                  </div>
                </div>

                {/* Agenda Hover Tooltip / Popup */}
                {isHovered && dayEvents.length > 0 && (
                  <div className="absolute left-full top-0 ml-2 z-50 w-64 p-5 rounded-[2rem] shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-2 duration-300 border border-white/10 hidden md:block"
                       style={{ background: isDarkMode ? 'rgba(20,20,20,0.95)' : 'rgba(255,255,255,0.95)' }}>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 border-b border-white/5 pb-2">Agenda • {day.toLocaleDateString('de-DE')}</p>
                    <div className="space-y-4">
                      {dayEvents.map((ev, i) => (
                        <div key={ev.id} className="flex items-start space-x-3 group/item">
                          <div className="w-1.5 h-8 rounded-full shrink-0" style={{ backgroundColor: EVENT_COLORS[i % EVENT_COLORS.length] }} />
                          <div className="min-w-0">
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>{ev.eventTime || 'Zeit?'}</p>
                            <p className={`text-[11px] font-bold uppercase tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{ev.question}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    if (!selectedDay) return null;
    const dateKey = formatISO(selectedDay);
    const dayEvents = eventsByDate[dateKey] || [];

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        <div className={`p-8 md:p-12 rounded-[3.5rem] border transition-colors shadow-xl ${
          isDarkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="flex items-center space-x-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-[#B5A47A] text-black`}>
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedDay.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}
                </h2>
                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                  {dayEvents.length} Termine am {selectedDay.getDate()}. {monthNames[selectedDay.getMonth()]}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isAdminOrVorstand && (
                <button 
                  onClick={() => setShowQuickCreate(!showQuickCreate)}
                  className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center space-x-2 ${
                    isDarkMode ? 'bg-white text-black' : 'bg-black text-white shadow-xl'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Hinzufügen</span>
                </button>
              )}
            </div>
          </div>

          {showQuickCreate && (
            <div className={`mb-12 p-8 rounded-3xl border animate-in zoom-in-95 duration-500 ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Case Titel</label>
                    <input 
                      type="text" 
                      value={newQuestion} 
                      onChange={e => setNewQuestion(e.target.value)} 
                      placeholder="Anlass der Sitzung..." 
                      className={`w-full bg-transparent border-b-2 py-3 text-sm font-bold outline-none transition-colors ${
                        isDarkMode ? 'border-white/10 focus:border-[#B5A47A] text-white' : 'border-slate-200 focus:border-[#B5A47A] text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Uhrzeit</label>
                    <input 
                      type="time" 
                      value={newTime} 
                      onChange={e => setNewTime(e.target.value)} 
                      className={`w-full bg-transparent border-b-2 py-3 text-sm font-bold outline-none ${
                        isDarkMode ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                    <button onClick={handleCreateInCalendar} className="w-full bg-[#B5A47A] text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                      Termin Bestätigen
                    </button>
                  </div>
                  <button onClick={() => setShowQuickCreate(false)} className="w-full text-center text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {dayEvents.length === 0 ? (
              <div className={`py-20 text-center rounded-[2.5rem] border-2 border-dashed ${
                isDarkMode ? 'border-white/5' : 'border-slate-100'
              }`}>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-20">Keine Einträge für diesen Tag</p>
              </div>
            ) : (
              dayEvents.map((event, i) => (
                <div 
                  key={event.id} 
                  className={`group relative p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row items-center gap-8 ${
                    isDarkMode ? 'bg-white/5 border-white/5 hover:border-[#B5A47A]/30' : 'bg-white border-slate-100 hover:border-[#B5A47A]/30 shadow-sm'
                  }`}
                >
                  <div className={`flex flex-col items-center justify-center min-w-[100px] h-20 rounded-2xl shadow-inner transition-colors group-hover:bg-opacity-80`}
                       style={{ backgroundColor: `${EVENT_COLORS[i % EVENT_COLORS.length]}20`, color: EVENT_COLORS[i % EVENT_COLORS.length] }}>
                    <span className="text-xl font-black">{event.eventTime || '--:--'}</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Start</span>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                       <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm`}
                             style={{ backgroundColor: EVENT_COLORS[i % EVENT_COLORS.length], color: '#000' }}>
                         ID {event.id.slice(-4)}
                       </span>
                    </div>
                    <h4 className={`text-xl font-bold uppercase tracking-tight ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                      {event.question}
                    </h4>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                      <p className={`text-[9px] font-black uppercase tracking-widest opacity-30`}>Status</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest">{event.tasks.length} Aufgaben</p>
                    </div>
                    <button 
                      onClick={() => onNavigateToCase(event.id)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg ${
                        isDarkMode ? 'bg-[#B5A47A] text-black' : 'bg-black text-white'
                      }`}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Premium Header Layout */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
        <div className="flex items-center space-x-4 p-1.5 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
          {(['year', 'month', 'day'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-8 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl ${
                viewMode === mode 
                  ? 'bg-[#B5A47A] text-black shadow-lg shadow-[#B5A47A]/30' 
                  : isDarkMode ? 'text-white/30 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {mode === 'year' ? 'Jahr' : mode === 'month' ? 'Monat' : 'Tag'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-8">
          <button 
            onClick={() => viewMode === 'year' ? changeYear(-1) : changeMonth(-1)} 
            className={`p-3.5 rounded-2xl border transition-all active:scale-90 ${
              isDarkMode ? 'bg-white/5 border-white/5 text-white/40' : 'bg-white border-slate-200 text-slate-400 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center min-w-[200px]">
            <h2 className={`text-2xl font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {viewMode === 'year' ? currentDate.getFullYear() : monthNames[currentDate.getMonth()]}
            </h2>
            <p className={`text-[8px] font-bold uppercase tracking-[0.5em] mt-1 ${isDarkMode ? 'text-[#B5A47A]/60' : 'text-[#B5A47A]'}`}>
              {viewMode === 'year' ? 'Timeline Overview' : `Kalender ${currentDate.getFullYear()}`}
            </p>
          </div>
          <button 
            onClick={() => viewMode === 'year' ? changeYear(1) : changeMonth(1)} 
            className={`p-3.5 rounded-2xl border transition-all active:scale-90 ${
              isDarkMode ? 'bg-white/5 border-white/5 text-white/40' : 'bg-white border-slate-200 text-slate-400 shadow-sm'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="min-h-[600px]">
        {viewMode === 'year' && renderYearView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      {/* Informativ Footer Bar */}
      <div className={`p-10 rounded-[3.5rem] border flex flex-col md:flex-row items-center justify-between gap-12 transition-all overflow-hidden relative ${
        isDarkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-6 relative z-10">
           <div className="w-16 h-16 rounded-3xl bg-[#B5A47A]/10 border border-[#B5A47A]/20 flex items-center justify-center text-[#B5A47A] shadow-inner transform rotate-3">
              <ListFilter className="w-7 h-7" />
           </div>
           <div className="text-center md:text-left">
              <h4 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Intelligente Planung</h4>
              <p className={`text-[10px] uppercase tracking-[0.2em] font-semibold mt-1 opacity-40`}>Alle Cases werden revisionssicher geloggt.</p>
           </div>
        </div>
        <div className="flex space-x-12 relative z-10">
           <div className="text-center">
              <span className={`block text-4xl font-black text-[#B5A47A] mb-1 tracking-tighter`}>{polls.filter(p => p.eventDate).length}</span>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Ereignisse</span>
           </div>
           <div className="text-center">
              <span className={`block text-4xl font-black ${isDarkMode ? 'text-white/40' : 'text-slate-300'} mb-1 tracking-tighter`}>{polls.filter(p => p.hasVoted).length}</span>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Abschluss</span>
           </div>
        </div>
        
        {/* Dekorative Hintergrund-Elemente */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B5A47A]/5 rounded-full blur-3xl -mr-16 -mt-16" />
      </div>
    </div>
  );
};
