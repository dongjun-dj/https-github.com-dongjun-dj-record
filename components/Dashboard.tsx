
import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, ReferenceLine, LabelList
} from 'recharts';
import { RecordEntry } from '../types';

interface DashboardProps {
  records: RecordEntry[];
}

const COLOR_GAIN = '#10b981'; 
const COLOR_LOSS = '#ef4444';

export const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const sortedRecords = useMemo(() => 
    [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  [records]);

  const cumulativeData = useMemo(() => {
    let sum = 0;
    return sortedRecords.map(r => {
      sum += r.amount;
      return {
        date: r.date,
        val: sum
      };
    });
  }, [sortedRecords]);

  // 处理分类数据，增加绝对值用于绘图
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      map[r.type] = (map[r.type] || 0) + r.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ 
      name, 
      value, // 实际值用于标签和颜色
      absVal: Math.abs(value) // 绝对值用于柱状图长度
    })).sort((a, b) => b.absVal - a.absVal); // 按规模排序
  }, [records]);

  const totalBalance = useMemo(() => 
    records.reduce((acc, curr) => acc + curr.amount, 0), 
  [records]);

  const winRate = useMemo(() => {
    if (records.length === 0) return 0;
    const wins = records.filter(r => r.amount > 0).length;
    return (wins / records.length * 100).toFixed(1);
  }, [records]);

  // X 轴范围仅基于绝对值最大值，确保柱体占满屏幕
  const xDomain = useMemo(() => {
    if (categoryData.length === 0) return [0, 100];
    const maxAbs = Math.max(...categoryData.map(d => d.absVal));
    // 预留极小缓冲，主要靠 margin.right 留空给标签
    return [0, maxAbs * 1.05] as [number, number];
  }, [categoryData]);

  // 自定义标签：显示原始带符号的值，位置固定在柱体右侧
  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const originalValue = categoryData[index].value;
    const isNeg = originalValue < 0;
    
    // 标签位置：柱体宽度 + 12px 间距
    return (
      <text 
        x={x + width + 12} 
        y={y + height / 2} 
        fill={isNeg ? COLOR_LOSS : COLOR_GAIN} 
        textAnchor="start" 
        dominantBaseline="middle"
        className="font-mono"
        style={{ fontSize: '13px', fontWeight: '900' }}
      >
        {originalValue >= 0 ? `+${originalValue.toLocaleString()}` : originalValue.toLocaleString()}
      </text>
    );
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white rounded-3xl shadow-sm border border-gray-100">
        <p className="text-slate-400 font-bold">尚无战报数据，请先记一笔成果</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">年度总结余</p>
          <div className={`text-3xl font-black tabular-nums ${totalBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {totalBalance >= 0 ? '+' : ''}{totalBalance.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">综合胜率</p>
          <div className="text-3xl font-black text-slate-700">{winRate}%</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">最大规模项</p>
          <div className="text-3xl font-black text-slate-700 truncate">
            {categoryData[0]?.name || '-'}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            各分类规模对比
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 盈利
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> 亏损
            </div>
          </div>
        </div>
        
        <div className="w-full h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={categoryData} 
              layout="vertical"
              /* 为右侧标签预留约 120px 空间，确保柱体比例合理 */
              margin={{ top: 10, right: 120, left: 30, bottom: 10 }}
              style={{ overflow: 'visible' }} 
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                domain={xDomain as any} 
                hide 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                width={80}
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 800 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any, name: any, props: any) => {
                  const originalVal = props.payload.value;
                  return [originalVal.toLocaleString(), '净收益'];
                }}
              />
              {/* 基准线固定在左侧 */}
              <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={2} />
              {/* Fix: Moved radius from Cell to Bar as it is not valid on Cell and causes type issues */}
              <Bar 
                dataKey="absVal" 
                barSize={32} 
                minPointSize={4}
                radius={[0, 6, 6, 0]} // 所有柱子统一向右圆角
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value >= 0 ? COLOR_GAIN : COLOR_LOSS} 
                  />
                ))}
                <LabelList dataKey="absVal" content={renderCustomLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-8">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
          年度收益曲线
        </h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                minTickGap={40}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="#4f46e5" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="累计成果"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
