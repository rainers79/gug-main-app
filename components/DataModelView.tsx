
import React from 'react';
import { Database, Link2, User, Vote, CheckSquare, Calendar, Receipt, ShoppingBag } from 'lucide-react';

// Added props interface for isDarkMode
export const DataModelView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const models = [
    { icon: <User />, name: 'User', fields: ['id', 'email', 'name', 'role', 'pos_enabled', 'birthday'] },
    { icon: <Vote />, name: 'Poll', fields: ['id', 'creator_id', 'question', 'is_multiple', 'due_date'] },
    { icon: <CheckSquare />, name: 'Task', fields: ['id', 'case_id', 'title', 'status', 'assigned_to[]', 'reminders[]'] },
    { icon: <Calendar />, name: 'CalendarEntry', fields: ['id', 'title', 'start', 'end', 'poll_id', 'case_id'] },
    { icon: <Receipt />, name: 'Receipt', fields: ['id', 'user_id', 'amount', 'date', 'file_url', 'audit_log'] },
    { icon: <ShoppingBag />, name: 'SalesArticle', fields: ['id', 'name', 'ingredients[]', 'base_cost'] },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Data & Persistence</h1>
        <p className="text-slate-500">Relationales Schema für die PostgreSQL Datenbank.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {models.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative group">
            <div className="absolute top-4 right-4 text-slate-200 group-hover:text-blue-100 transition-colors">
              <Database className="w-12 h-12" />
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                {m.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{m.name}</h3>
            </div>
            <ul className="space-y-2">
              {m.fields.map((f, fi) => (
                <li key={fi} className="flex items-center space-x-2 text-sm text-slate-600 font-mono">
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">PostgreSQL Table</span>
              <Link2 className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white">
        <h4 className="text-xl font-bold mb-6 flex items-center">
          <Link2 className="w-6 h-6 mr-3 text-blue-400" /> Beziehungs-Logik (Cross-Module)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-blue-400 font-bold mb-1">Poll 1:1 Case</p>
              <p className="text-slate-400">Jede Umfrage initiiert einen Case-Workspace (Chat, Log, Aufgaben).</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-blue-400 font-bold mb-1">Case 1:N Tasks</p>
              <p className="text-slate-400">Ein Case kann beliebig viele spezifische Aufgaben haben.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-emerald-400 font-bold mb-1">Task 1:N Reminders</p>
              <p className="text-slate-400">Jede Aufgabe kann komplexe Erinnerungs-Regeln besitzen.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-emerald-400 font-bold mb-1">Article N:M Ingredient</p>
              <p className="text-slate-400">Wiederverwendbare Zutaten für die Preiskalkulation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
