
import React, { useState } from 'react';
import { Button } from './Button';
import { RecordEntry, RecordType } from '../types';

interface AddRecordModalProps {
  categories: string[];
  onAdd: (record: Omit<RecordEntry, 'id'>) => void;
  onClose: () => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({ categories, onAdd, onClose }) => {
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<RecordType>(categories[0] || '麻将');
  const [note, setNote] = useState<string>('');
  const [isNewType, setIsNewType] = useState<boolean>(false);
  const [customType, setCustomType] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val)) return;

    onAdd({
      amount: val,
      date,
      type: isNewType ? customType : type,
      note
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">新增收益记录</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">盈亏金额</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">¥</span>
              <input 
                type="number" 
                required
                placeholder="例如: 1000 或 -500"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 font-medium"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">正数代表盈利，负数代表亏损</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">日期</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">项目类型</label>
              {!isNewType ? (
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm appearance-none bg-no-repeat bg-[right_1rem_center]"
                  value={type}
                  // Handle "new type" selection logic in onChange to avoid side effects during render
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__new__') {
                      setIsNewType(true);
                    } else {
                      setType(val);
                    }
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__new__">+ 添加新类型</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  placeholder="新类型名称"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  onBlur={() => { if (!customType) setIsNewType(false); }}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">备注 (可选)</label>
            <textarea 
              rows={2}
              placeholder="记录一下今天的心得或细节..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>取消</Button>
            <Button variant="primary" className="flex-1" type="submit">确认添加</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
