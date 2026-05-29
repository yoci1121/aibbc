export interface Staff {
  id: string;
  name: string;
}

export interface ShiftPattern {
  id: string;
  name: string;
  label: string;
  startTime: string;
  endTime: string;
  color: string;
  bgColor: string;
  hours: number;
}

export interface ShiftEntry {
  staffId: string;
  date: string; // YYYY-MM-DD
  patternId: string;
}

export type ShiftData = Record<string, Record<string, string>>;
// staffId -> date -> patternId
