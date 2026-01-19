
import React, { useState, useEffect } from 'react';
import { RecordEntry } from './types';
import { Dashboard } from './components/Dashboard';
import { RecordList } from './components/RecordList';
import { AddRecordModal } from './components/AddRecordModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Button } from './components/Button';
import { ICONS, DEFAULT_CATEGORIES } from './constants';

const STORAGE_KEY = 'cutting_edge_results_records_v1';
const CAT_STORAGE_KEY = 'cutting_edge_results_categories_v1';

const App: React.FC = () => {
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    const savedCats = localStorage.getItem(CAT_STORAGE_KEY);
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error("Parse error", e);
      }
    }
    if (savedCats) {
      try {
        setCategories(JSON.parse(savedCats));
      } catch (e) {
        console.error("Parse error", e);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const handleAddRecord = (newRecord: Omit<RecordEntry, 'id'>) => {
    const record: RecordEntry = {
      ...newRecord,
      id: crypto.randomUUID()
    };
    setRecords(prev => [record, ...prev]);
    
    if (!categories.includes(newRecord.type)) {
      setCategories(prev => [...prev, newRecord.type]);
    }
  };

  const confirmDeleteRecord = () => {
    if (recordToDelete) {
      setRecords(prev => prev.filter(r => r.id !== recordToDelete));
      setRecordToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <ICONS.TrendingUp />
            </div>
            <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              交流切磋成果录
            </h1>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant={activeTab === 'dashboard' ? 'primary' : 'ghost'} 
              size="sm" 
              icon={<ICONS.LayoutDashboard />}
              onClick={() => setActiveTab('dashboard')}
              className="hidden md:inline-flex"
            >
              数据看板
            </Button>
            <Button 
              variant={activeTab === 'history' ? 'primary' : 'ghost'} 
              size="sm" 
              icon={<ICONS.History />}
              onClick={() => setActiveTab('history')}
              className="hidden md:inline-flex"
            >
              往日战报
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <Button 
              variant="primary" 
              size="sm" 
              icon={<ICONS.Plus />}
              onClick={() => setIsModalOpen(true)}
              className="shadow-md shadow-indigo-100"
            >
              记一笔
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {activeTab === 'dashboard' ? '成果实时分析' : '往日切磋复盘'}
          </h2>
          <p className="text-slate-400 font-medium mt-1">
            {activeTab === 'dashboard' ? '年度数据汇总，洞察博弈盈亏。' : '记录每一场切磋，总结得失。'}
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' ? (
            <Dashboard records={records} />
          ) : (
            <RecordList records={records} onDelete={(id) => setRecordToDelete(id)} />
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 py-3 px-6 md:hidden flex justify-around items-center z-40">
        <button 
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <ICONS.LayoutDashboard />
          <span className="text-[10px] font-black uppercase">看板</span>
        </button>
        <button 
          className="w-14 h-14 -mt-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-slate-50"
          onClick={() => setIsModalOpen(true)}
        >
          <ICONS.Plus />
        </button>
        <button 
          className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-indigo-600' : 'text-slate-400'}`}
          onClick={() => setActiveTab('history')}
        >
          <ICONS.History />
          <span className="text-[10px] font-black uppercase">历史</span>
        </button>
      </nav>

      {isModalOpen && (
        <AddRecordModal 
          categories={categories}
          onAdd={handleAddRecord}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {recordToDelete && (
        <DeleteConfirmModal 
          onConfirm={confirmDeleteRecord}
          onClose={() => setRecordToDelete(null)}
        />
      )}
    </div>
  );
};

export default App;
