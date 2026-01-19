
import React from 'react';
import { RecordEntry } from '../types';
import { ICONS } from '../constants';

interface RecordListProps {
  records: RecordEntry[];
  onDelete: (id: string) => void;
}

export const RecordList: React.FC<RecordListProps> = ({ records, onDelete }) => {
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <ICONS.History />
        </div>
        <p className="text-gray-400 font-bold">尚无往日战报</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
              <th className="px-8 py-6">战报日期</th>
              <th className="px-8 py-6">项目名称</th>
              <th className="px-8 py-6">盈亏成果</th>
              <th className="px-8 py-6">复盘笔记</th>
              <th className="px-8 py-6 text-right">管理</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedRecords.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/20 transition-colors group">
                <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-500 font-bold">
                  {record.date}
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-indigo-50 text-indigo-600 uppercase tracking-wider">
                    {record.type}
                  </span>
                </td>
                <td className={`px-8 py-6 whitespace-nowrap font-black text-xl ${record.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {record.amount >= 0 ? '+' : ''}{record.amount.toLocaleString()}
                </td>
                <td className="px-8 py-6 text-sm text-slate-400 italic truncate max-w-[240px]">
                  {record.note || '-'}
                </td>
                <td className="px-8 py-6 text-right whitespace-nowrap">
                  <button 
                    type="button"
                    onClick={() => onDelete(record.id)}
                    className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95 active:bg-rose-100/50"
                    title="确认删除该历史记录"
                  >
                    <div className="pointer-events-none flex items-center justify-center">
                      <ICONS.Trash />
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
