
import React from 'react';
import { Button } from './Button';

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" x2="10" y1="11" y2="17"/>
              <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">确定要删除吗？</h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed px-4">
            此操作将永久移除该条战报记录，相关数据看板也将同步更新。此操作不可撤销。
          </p>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <Button 
            variant="secondary" 
            className="flex-1 !rounded-2xl py-3 border-slate-200 text-slate-500 hover:bg-slate-50" 
            onClick={onClose}
          >
            我再想想
          </Button>
          <Button 
            variant="danger" 
            className="flex-1 !rounded-2xl py-3 !bg-rose-500 !text-white border-none hover:!bg-rose-600 shadow-lg shadow-rose-200" 
            onClick={onConfirm}
          >
            确定删除
          </Button>
        </div>
      </div>
    </div>
  );
};
