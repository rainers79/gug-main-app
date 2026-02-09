
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Calculator, Info, ShoppingCart, Lock } from 'lucide-react';
import { Ingredient, Role } from '../types';

interface InteractiveDemoProps {
  userRole: Role;
  // Added isDarkMode to satisfy TypeScript
  isDarkMode: boolean;
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({ userRole, isDarkMode }) => {
  const canEdit = userRole === Role.ADMIN || userRole === Role.VORSTAND;

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Bun', usedQuantity: 1, referenceQuantity: 1, referencePrice: 0.8, unit: 'piece' },
    { id: '2', name: 'Patty', usedQuantity: 1, referenceQuantity: 1, referencePrice: 1.5, unit: 'piece' },
    { id: '3', name: 'Salz', usedQuantity: 5, referenceQuantity: 100, referencePrice: 3.0, unit: 'g' },
  ]);

  const addIngredient = () => {
    if (!canEdit) return;
    const newIng: Ingredient = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Neue Zutat',
      usedQuantity: 10,
      referenceQuantity: 100,
      referencePrice: 1.0,
      unit: 'g'
    };
    setIngredients([...ingredients, newIng]);
  };

  const removeIngredient = (id: string) => {
    if (!canEdit) return;
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    if (!canEdit) return;
    setIngredients(ingredients.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const totalCost = useMemo(() => {
    return ingredients.reduce((sum, ing) => {
      const cost = (ing.usedQuantity / ing.referenceQuantity) * ing.referencePrice;
      return sum + cost;
    }, 0);
  }, [ingredients]);

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-6">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Kostenkalkulator</h1>
          <p className="text-slate-500 text-sm">Validierung der Verkaufs-Logik.</p>
        </div>
        {!canEdit && (
          <div className="flex items-center space-x-2 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-slate-200">
            <Lock className="w-3 h-3" />
            <span>Nur Ansicht</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center text-sm md:text-base">
                <ShoppingCart className="w-4 h-4 mr-2" /> "Classic Burger"
              </h3>
              {canEdit && (
                <button 
                  onClick={addIngredient}
                  className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center font-semibold"
                >
                  <Plus className="w-3 h-3 mr-1" /> Neu
                </button>
              )}
            </div>
            
            <div className="p-4 space-y-3">
              {ingredients.map((ing) => (
                <div key={ing.id} className={`flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-2 items-start md:items-center p-3 rounded-xl border ${canEdit ? 'bg-slate-50 border-slate-100' : 'bg-white border-transparent'}`}>
                  <div className="w-full md:col-span-4">
                    <input 
                      disabled={!canEdit}
                      className={`w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${!canEdit && 'border-none font-semibold p-0'}`} 
                      value={ing.name} 
                      placeholder="Name der Zutat"
                      onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="w-full flex md:col-span-3 items-center space-x-2">
                    <div className="relative flex-1">
                      <input 
                        disabled={!canEdit}
                        type="number"
                        className={`w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${!canEdit && 'border-none p-0'}`} 
                        value={ing.usedQuantity} 
                        onChange={(e) => updateIngredient(ing.id, 'usedQuantity', parseFloat(e.target.value) || 0)}
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold uppercase">{ing.unit}</span>
                    </div>
                    <span className="text-slate-300">/</span>
                    <div className="relative flex-1">
                      <input 
                        disabled={!canEdit}
                        type="number"
                        className={`w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${!canEdit && 'border-none p-0'}`} 
                        value={ing.referencePrice} 
                        onChange={(e) => updateIngredient(ing.id, 'referencePrice', parseFloat(e.target.value) || 0)}
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold uppercase">€</span>
                    </div>
                  </div>

                  <div className="w-full md:col-span-5 flex items-center justify-between border-t md:border-t-0 pt-2 md:pt-0">
                    <div className="text-xs text-slate-400 md:hidden font-bold uppercase">Einzelkosten</div>
                    <div className="flex items-center space-x-4">
                      <div className="font-mono text-sm font-bold text-slate-700">
                        € {((ing.usedQuantity / ing.referenceQuantity) * ing.referencePrice).toFixed(2)}
                      </div>
                      {canEdit && (
                        <button onClick={() => removeIngredient(ing.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-start space-x-3 border ${canEdit ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
            <Info className={`w-5 h-5 mt-0.5 shrink-0 ${canEdit ? 'text-blue-600' : 'text-slate-400'}`} />
            <div className={`text-[11px] md:text-xs leading-relaxed ${canEdit ? 'text-blue-800' : 'text-slate-500'}`}>
              <strong>Info:</strong> {canEdit 
                ? 'Sie bearbeiten gerade einen Live-Artikel. Alle Berechnungen erfolgen proportional.' 
                : 'Sie sehen die Kostenaufstellung dieses Artikels. Nur Admins oder Vorstand können Änderungen vornehmen.'}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white text-center shadow-xl">
            <Calculator className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <p className="text-slate-400 text-xs mb-1 uppercase tracking-widest font-bold">Selbstkosten</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">€ {totalCost.toFixed(2)}</h2>
            {canEdit ? (
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40">
                Speichern
              </button>
            ) : (
              <div className="text-[10px] text-slate-500 italic">Preise fixiert durch Admin</div>
            )}
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold mb-4 text-slate-800 text-sm">Wirtschaftlichkeit</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Zutaten</span>
                <span className="font-bold">{ingredients.length}</span>
              </div>
              <div className="flex justify-between text-xs border-t pt-3">
                <span className="text-slate-500">VK-Vorschlag (3.5x)</span>
                <span className="font-bold text-emerald-600 text-sm">€ {(totalCost * 3.5).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
