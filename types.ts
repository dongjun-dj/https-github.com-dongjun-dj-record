
export type RecordType = '麻将' | '德州' | string;

export interface RecordEntry {
  id: string;
  amount: number;
  date: string;
  type: RecordType;
  note?: string;
}

export interface SummaryStats {
  totalGain: number;
  totalCount: number;
  winRate: number;
  byType: Record<string, number>;
}
