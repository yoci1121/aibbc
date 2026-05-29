import { useState } from "react";
import ShiftCalendar from "./components/ShiftCalendar";
import ShiftPatternEditor from "./components/ShiftPatternEditor";
import StaffSummary from "./components/StaffSummary";
import ShiftEditModal from "./components/ShiftEditModal";
import { STAFF_LIST, DEFAULT_PATTERNS, SAMPLE_SHIFT_DATA } from "./data/sampleData";
import type { ShiftPattern, ShiftData } from "./types";

type Tab = "calendar" | "summary" | "patterns";

export default function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [patterns, setPatterns] = useState<ShiftPattern[]>(DEFAULT_PATTERNS);
  const [shiftData, setShiftData] = useState<ShiftData>(SAMPLE_SHIFT_DATA);
  const [tab, setTab] = useState<Tab>("calendar");
  const [editing, setEditing] = useState<{ staffId: string; date: string } | null>(null);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  function handleCellClick(staffId: string, date: string) {
    setEditing({ staffId, date });
  }

  function handleSaveShift(staffId: string, date: string, patternId: string) {
    setShiftData(prev => ({
      ...prev,
      [staffId]: { ...(prev[staffId] ?? {}), [date]: patternId },
    }));
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-700">シフト管理</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-600 text-lg"
              aria-label="前月"
            >
              ‹
            </button>
            <span className="text-base font-semibold text-gray-800 w-28 text-center">
              {year}年{month}月
            </span>
            <button
              onClick={nextMonth}
              className="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-600 text-lg"
              aria-label="翌月"
            >
              ›
            </button>
            <button
              onClick={() => window.print()}
              className="ml-4 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              印刷 / PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-0 border-t border-gray-100">
          {(["calendar", "summary", "patterns"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "calendar" ? "カレンダー" : t === "summary" ? "勤務集計" : "パターン設定"}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {tab === "calendar" && (
          <>
            <div className="flex flex-wrap gap-2 no-print">
              {patterns.map((p) => (
                <span
                  key={p.id}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${p.bgColor} ${p.color}`}
                >
                  <span className="font-bold">{p.label}</span>
                  {p.name}
                  {p.startTime && (
                    <span className="opacity-75">（{p.startTime}〜{p.endTime}）</span>
                  )}
                </span>
              ))}
            </div>
            <ShiftCalendar
              year={year}
              month={month}
              staff={STAFF_LIST}
              patterns={patterns}
              shiftData={shiftData}
              onCellClick={handleCellClick}
            />
          </>
        )}

        {tab === "summary" && (
          <StaffSummary
            year={year}
            month={month}
            staff={STAFF_LIST}
            patterns={patterns}
            shiftData={shiftData}
          />
        )}

        {tab === "patterns" && (
          <ShiftPatternEditor patterns={patterns} onChange={setPatterns} />
        )}
      </main>

      {editing && (
        <ShiftEditModal
          staffId={editing.staffId}
          date={editing.date}
          currentPatternId={shiftData[editing.staffId]?.[editing.date] ?? ""}
          staff={STAFF_LIST}
          patterns={patterns}
          onSave={handleSaveShift}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
