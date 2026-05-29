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

export interface ShiftSlot {
  patternId: string;
  confirmed: boolean;
}

export type ShiftData = Record<string, Record<string, ShiftSlot>>;
// staffId -> date -> ShiftSlot

export type ClosedDays = Record<string, string>;
// date (YYYY-MM-DD) -> label (例: "元旦", "創立記念日", "")
