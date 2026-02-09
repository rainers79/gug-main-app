
import React, { useState } from 'react';
import { Vote, Plus, MessageSquare, Lock, Users, BarChart3, Trash2, ShieldCheck, AlertCircle, User as UserIcon, Check, CheckSquare, Clock, Send, ChevronRight, ArrowLeft, Calendar as CalendarIcon, Edit3, X } from 'lucide-react';
import { Role } from '../types';
import { Poll } from '../App';
import { COLORS } from '../constants';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  assignedUserId: string;
  status: 'OPEN' | 'COMPLETED';
}

interface MockUser {
  id: string;
  name: string;
  role: Role;
}

const MOCK_USERS: MockUser[] = [
  { id: 'u1', name: 'Christian Weber', role: Role.VORSTAND },
  { id: 'u2', name: 'Sabine Maier', role: Role.USER },
  { id: 'u3', name: 'Thomas Müller', role: Role.USER },
  { id: 'u4', name: 'Julia Schneider', role: Role.ADMIN },
  { id: 'u5', name: 'Andreas Hofer', role: Role.USER },
  { id: 'u6', name: 'Maria Leitner', role: Role.USER },
];

interface PollSimulatorProps {
  userRole: Role;
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  isDarkMode: boolean;
}

export const PollSimulator: React.FC<PollSimulatorProps> = ({ userRole, polls, setPolls, isDarkMode }) => {
  const isAdminOrVorstand = userRole === Role.ADMIN || userRole === Role.VORSTAND;
  const isVisitor = userRole === Role.VISITOR;

  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '']);
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  const [activePollForTask, setActivePollForTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignedId, setNewTaskAssignedId] = useState('');
  const [chatInputs, setChatInputs] = useState<{[key: string]: string}>({});

  const handleVote = (pollId: string, optionId: string) => {
    if (isVisitor) return;
    setPolls(polls.map(p => {
      if (p.id === pollId && !p.hasVoted) {
        return {
          ...p,
          hasVoted: true,
          totalVotes: p.totalVotes + 1,
          votedUserIds: [...p.votedUserIds, 'currentUser'],
          options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
        };
      }
      return p;
    }));
  };

  const addTask = (pollId: string) => {
    if (!newTaskTitle || !newTaskAssignedId) return;
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        const newTask: Task = {
          id: Date.now().toString(),
          title: newTaskTitle,
          assignedUserId: newTaskAssignedId,
          status: 'OPEN'
        };
        return { ...p, tasks: [...p.tasks, newTask] };
      }
      return p;
    }));
    setNewTaskTitle('');
    setNewTaskAssignedId('');
    setActivePollForTask(null);
  };

  const handleSendMessage = (pollId: string) => {
    const text = chatInputs[pollId];
    if (!text || text.trim() === '') return;
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: 'currentUser',
          senderName: `Ich (${userRole})`,
          text: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return { ...p, messages: [...p.messages, newMessage] };
      }
      return p;
    }));
    setChatInputs({ ...chatInputs, [pollId]: '' });
  };

  const toggleTaskStatus = (pollId: string, taskId: string) => {
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'OPEN' ? 'COMPLETED' : 'OPEN' } : t)
        };
      }
      return p;
    }));
  };

  const createPoll = () => {
    const validOptions = newOptions.filter(opt => opt.trim() !== '');
    if (!newQuestion || validOptions.length < 2) return;
    const newPoll: Poll = {
      id: Date.now().toString(),
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
      eventDate: newEventDate || undefined,
      eventTime: newEventTime || undefined
    };
    setPolls([newPoll, ...polls]);
    setNewQuestion('');
    setNewOptions(['', '']);
    setShowCreate(false);
    setSelectedPollId(newPoll.id);
  };

  const visiblePolls = polls.filter(poll => {
    if (isAdminOrVorstand) return true;
    if (poll.isAllTargeted) return true;
    if (poll.targetGroups.includes(userRole)) return true;
    return false;
  });

  const selectedPoll = polls.find(p => p.id === selectedPollId);

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      
      <div className={`flex justify-between items-center border-b pb-12 gap-10 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="flex items-center space-x-10">
          {selectedPollId && (
            <button 
              onClick={() => setSelectedPollId(null)}
              className={`p-5 rounded-2xl transition-all shadow-xl active:scale-95 border ${
                isDarkMode ? 'bg-[#1A1A1A] border-white/5 hover:border-[#B5A47A]/40' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
             <p className="text-[#B5A47A] text-[11px] font-black uppercase tracking-[0.5em] mb-4">Command Center</p>
            <h1 className={`text-4xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {selectedPollId ? 'Case Deep Dive' : 'Operations Pool'}
            </h1>
          </div>
        </div>
        {isAdminOrVorstand && !showCreate && !selectedPollId && (
          <button 
            onClick={() => setShowCreate(true)}
            className={`px-12 py-5 text-[11px] font-black uppercase tracking-widest rounded-full transition-all shadow-2xl active:scale-95 ${
              isDarkMode ? 'bg-[#B5A47A] text-black hover:scale-[1.05] shadow-[#B5A47A]/20' : 'bg-black text-white hover:bg-[#B5A47A] hover:text-black'
            }`}
          >
            Neuer Einsatz
          </button>
        )}
      </div>

      {!selectedPollId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {visiblePolls.map((poll) => (
            <button 
              key={poll.id}
              onClick={() => setSelectedPollId(poll.id)}
              className={`group p-12 rounded-[4rem] border transition-all duration-500 text-left flex flex-col min-h-[440px] ${
                isDarkMode 
                  ? 'bg-[#111111] border-[#B5A47A]/10 hover:border-[#B5A47A]/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]' 
                  : 'bg-white border-slate-200 hover:shadow-2xl shadow-slate-200/50 hover:border-[#B5A47A]/40'
              }`}
            >
              <div className="flex justify-between items-start mb-14">
                <div className={`text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl shadow-lg ${
                  poll.hasVoted 
                    ? 'bg-black text-[#B5A47A] border border-[#B5A47A]/20' 
                    : isDarkMode ? 'bg-[#1A1A1A] text-white/40' : 'bg-slate-100 text-slate-400'
                }`}>
                  {poll.hasVoted ? 'ZERTIFIZIERT' : 'MISSION OFFEN'}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest opacity-30`}>{poll.createdAt}</span>
              </div>

              <h3 className={`text-3xl font-black mb-10 leading-tight uppercase group-hover:text-[#B5A47A] transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {poll.question}
              </h3>

              {poll.eventDate && (
                <div className={`mb-12 flex items-center text-[11px] font-black uppercase tracking-[0.4em] px-8 py-4 rounded-2xl w-fit border ${
                  isDarkMode ? 'bg-black/40 border-[#B5A47A]/20 text-[#B5A47A]' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <CalendarIcon className="w-4 h-4 mr-4" />
                  {new Date(poll.eventDate).toLocaleDateString('de-DE')}
                </div>
              )}

              <div className={`mt-auto pt-10 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <div className="flex space-x-12 text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-3 text-[#B5A47A]" /> {poll.totalVotes} Members</span>
                  <span className="flex items-center"><CheckSquare className="w-4 h-4 mr-3 text-[#B5A47A]" /> {poll.tasks.length} Tasks</span>
                </div>
                <div className={`p-5 rounded-2xl transition-all ${
                  isDarkMode ? 'bg-black/40 group-hover:bg-[#B5A47A] group-hover:text-black' : 'bg-slate-100 group-hover:bg-black group-hover:text-white'
                }`}>
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedPollId && selectedPoll && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in slide-in-from-right-12 duration-700">
          <div className="lg:col-span-5 space-y-12">
            <div className={`rounded-[4.5rem] border overflow-hidden flex flex-col shadow-2xl transition-all ${
              isDarkMode ? 'bg-[#121212] border-[#B5A47A]/20' : 'bg-white border-slate-200'
            }`}>
              <div className={`p-16 border-b text-center ${isDarkMode ? 'border-white/5 bg-black/40' : 'border-slate-100 bg-slate-50/50'}`}>
                <span className="text-[11px] font-black text-[#B5A47A] uppercase tracking-[0.6em] mb-8 block">Voting Protocol</span>
                <h3 className={`text-4xl font-black leading-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedPoll.question}</h3>
              </div>

              <div className="p-16 flex-1 space-y-8">
                {selectedPoll.options.map((opt) => {
                  const percentage = selectedPoll.totalVotes > 0 ? (opt.votes / selectedPoll.totalVotes) * 100 : 0;
                  return (
                    <button
                      key={opt.id}
                      disabled={selectedPoll.hasVoted || isVisitor}
                      onClick={() => handleVote(selectedPoll.id, opt.id)}
                      className={`w-full relative p-10 rounded-[2.8rem] border transition-all text-left overflow-hidden group shadow-lg ${
                        selectedPoll.hasVoted 
                        ? (isDarkMode ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50/50') 
                        : (isDarkMode ? 'border-white/10 bg-[#1A1A1A] hover:border-[#B5A47A] hover:bg-black hover:scale-[1.02]' : 'border-slate-200 bg-white hover:border-[#B5A47A] shadow-md hover:scale-[1.01]')
                      }`}
                    >
                      {selectedPoll.hasVoted && (
                        <div className={`absolute left-0 top-0 bottom-0 rounded-r-[2.2rem] transition-all duration-1000 ${isDarkMode ? 'bg-[#B5A47A]/20' : 'bg-[#B5A47A]/10'}`} style={{ width: `${percentage}%` }} />
                      )}
                      <div className="relative flex justify-between items-center z-10">
                        <span className={`font-black text-xs uppercase tracking-[0.25em] ${isDarkMode ? 'text-white/80 group-hover:text-white' : 'text-slate-700'}`}>{opt.text}</span>
                        {selectedPoll.hasVoted && (
                          <div className="flex flex-col items-end">
                            <span className={`text-lg font-black ${isDarkMode ? 'text-[#B5A47A]' : 'text-slate-900'}`}>{percentage.toFixed(0)}%</span>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{opt.votes} Stm</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`p-16 rounded-[4.5rem] border shadow-2xl relative overflow-hidden transition-all ${
              isDarkMode ? 'bg-[#B5A47A] text-black border-[#B5A47A]/40' : 'bg-black text-white border-black'
            }`}>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
              <div className="flex items-center justify-between mb-14 border-b border-white/10 pb-10 relative z-10">
                <h4 className="text-[12px] font-black uppercase tracking-[0.6em] opacity-60">Event Schedule</h4>
              </div>
              
              <div className="relative z-10">
                {selectedPoll.eventDate ? (
                  <div className="space-y-8">
                    <p className="text-5xl font-black uppercase tracking-tighter">{new Date(selectedPoll.eventDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}</p>
                    <div className="bg-white/10 backdrop-blur-md w-fit px-10 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] shadow-inner">
                      {selectedPoll.eventTime || '??:??'} UHR
                    </div>
                  </div>
                ) : (
                  <p className="opacity-30 italic text-sm font-black uppercase tracking-widest">TBD</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div className={`rounded-[4.5rem] border flex flex-col min-h-[640px] shadow-2xl transition-all ${
              isDarkMode ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-200'
            }`}>
              <div className={`p-14 border-b text-center ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                <span className="text-[11px] font-black uppercase tracking-[0.8em] opacity-40">Direct Communication Hub</span>
              </div>

              <div className="flex-1 overflow-y-auto p-14 space-y-10">
                {selectedPoll.messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderId === 'currentUser' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-10 rounded-[3rem] shadow-xl ${
                      msg.senderId === 'currentUser' 
                        ? 'bg-[#B5A47A] text-black rounded-tr-none' 
                        : (isDarkMode ? 'bg-[#1A1A1A] text-white rounded-tl-none border border-white/5' : 'bg-slate-50 text-slate-900 rounded-tl-none border border-slate-100 shadow-sm')
                    }`}>
                       <div className="flex justify-between items-center mb-5 gap-16">
                         <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{msg.senderName}</span>
                         <span className="text-[10px] font-bold opacity-30">{msg.timestamp}</span>
                       </div>
                       <p className="text-sm font-bold leading-relaxed tracking-tight">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-12 border-t rounded-b-[4.5rem] ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50/80 border-slate-100'}`}>
                <div className={`flex gap-4 p-4 rounded-[2.5rem] border transition-all ${
                  isDarkMode ? 'bg-white/5 border-white/10 focus-within:border-[#B5A47A]/40' : 'bg-white border-slate-200 focus-within:border-[#B5A47A]/50 shadow-inner'
                }`}>
                  <input 
                    type="text" 
                    placeholder="Übermittlung starten..." 
                    className="flex-1 bg-transparent px-8 py-5 text-sm outline-none font-black uppercase tracking-tight"
                    value={chatInputs[selectedPoll.id] || ''}
                    onChange={(e) => setChatInputs({ ...chatInputs, [selectedPoll.id]: e.target.value })}
                  />
                  <button onClick={() => handleSendMessage(selectedPoll.id)} className={`p-6 rounded-2xl transition-all shadow-2xl active:scale-90 ${
                    isDarkMode ? 'bg-[#B5A47A] text-black hover:scale-105' : 'bg-black text-white hover:bg-[#B5A47A] hover:text-black'
                  }`}>
                    <Send className="w-7 h-7" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
