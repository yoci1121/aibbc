import type { Staff, ShiftPattern, ShiftData } from "../types";

export const STAFF_LIST: Staff[] = [
  { id: "s1", name: "田中 花子" },
  { id: "s2", name: "鈴木 太郎" },
  { id: "s3", name: "山田 美咲" },
  { id: "s4", name: "佐藤 健" },
  { id: "s5", name: "伊藤 さくら" },
];

export const DEFAULT_PATTERNS: ShiftPattern[] = [
  {
    id: "early",
    name: "早番",
    label: "早",
    startTime: "08:00",
    endTime: "17:00",
    color: "text-blue-800",
    bgColor: "bg-blue-100",
    hours: 8,
  },
  {
    id: "late",
    name: "遅番",
    label: "遅",
    startTime: "13:00",
    endTime: "22:00",
    color: "text-purple-800",
    bgColor: "bg-purple-100",
    hours: 8,
  },
  {
    id: "full",
    name: "通し",
    label: "通",
    startTime: "10:00",
    endTime: "19:00",
    color: "text-green-800",
    bgColor: "bg-green-100",
    hours: 8,
  },
  {
    id: "half",
    name: "半日",
    label: "半",
    startTime: "09:00",
    endTime: "14:00",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100",
    hours: 4,
  },
  {
    id: "off",
    name: "休み",
    label: "休",
    startTime: "",
    endTime: "",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    hours: 0,
  },
];

function makeShiftData(year: number, month: number): ShiftData {
  const daysInMonth = new Date(year, month, 0).getDate();
  const data: ShiftData = {};
  const patternIds = ["early", "late", "full", "half", "off"];

  STAFF_LIST.forEach((staff, si) => {
    data[staff.id] = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dow = new Date(year, month - 1, d).getDay();
      if (dow === 0 || dow === 6) {
        data[staff.id][date] = "off";
      } else {
        const idx = (si + d) % 4;
        data[staff.id][date] = patternIds[idx];
      }
    }
  });

  return data;
}

export const SAMPLE_SHIFT_DATA = makeShiftData(
  new Date().getFullYear(),
  new Date().getMonth() + 1
);
