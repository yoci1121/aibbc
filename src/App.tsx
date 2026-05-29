import { useState } from "react";
import ShiftCalendar from "./components/ShiftCalendar";
import ShiftPatternEditor from "./components/ShiftPatternEditor";
import StaffSummary from "./components/StaffSummary";
import ShiftEditModal from "./components/ShiftEditModal";
import StaffManager from "./components/StaffManager";
import HolidayManager from "./components/HolidayManager";
import { STAFF_LIST, DEFAULT_PATTERNS, SAMPLE_SHIFT_DATA } from "./data/sampleData";
import type { Staff, ShiftPattern, ShiftData, ClosedDays } from "./types";

type Tab = "calendar" | "summary" | "patterns" | "staff" | "holidays";

const TAB_LABELS: Record<Tab, string> = {
  calendar: "カレンダー",
  summary: "勤務集計",
  patterns: "パターン設定",
  staff: "スタッフ管理",
  holidays: "休診日設定",
};

export default function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [staff, setStaff] = useState<Staff[]>(STAFF_LIST);
  const [patterns, setPatterns] = useState<ShiftPattern[]>(DEFAULT_PATTERNS);
  const [shiftData, setShiftData] = useState<ShiftData>(SAMPLE_SHIFT_DATA);
  const [closedDays, setClosedDays] = useState<ClosedDays>({});
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

  function handleStaffChange(newStaff: Staff[]) {
    const removedIds = staff.map(s => s.id).filter(id => !newStaff.find(s => s.id === id));
    if (removedIds.length > 0) {
      setShiftData(prev => {
        const next = { ...prev };
        removedIds.forEach(id => delete next[id]);
        return next;
      });
    }
    setStaff(newStaff);
  }

  const showMonthNav = tab === "calendar" || tab === "summary";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-700">シフト管理</h1>
          <div className="flex items-center gap-2">
            {showMonthNav && (
              <>
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
              </>
            )}
            <button
              onClick={() => window.print()}
              className="ml-2 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              印刷 / PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex border-t border-gray-100">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {TAB_LABELS[t]}
              {t === "staff" && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs">
                  {staff.length}
                </span>
              )}
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
            {staff.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <p className="text-sm">スタッフが登録されていません</p>
                <button
                  onClick={() => setTab("staff")}
                  className="mt-3 text-indigo-600 text-sm underline"
                >
                  スタッフ管理へ
                </button>
              </div>
            ) : (
              <ShiftCalendar
                year={year}
                month={month}
                staff={staff}
                patterns={patterns}
                shiftData={shiftData}
                closedDays={closedDays}
                onCellClick={handleCellClick}
              />
            )}
          </>
        )}

        {tab === "summary" && (
          <StaffSummary
            year={year}
            month={month}
            staff={staff}
            patterns={patterns}
            shiftData={shiftData}
          />
        )}

        {tab === "patterns" && (
          <ShiftPatternEditor patterns={patterns} onChange={setPatterns} />
        )}

        {tab === "staff" && (
          <StaffManager staff={staff} onChange={handleStaffChange} />
        )}

        {tab === "holidays" && (
          <HolidayManager closedDays={closedDays} onChange={setClosedDays} />
        )}
      </main>

      {editing && (
        <ShiftEditModal
          staffId={editing.staffId}
          date={editing.date}
          currentPatternId={shiftData[editing.staffId]?.[editing.date] ?? ""}
          staff={staff}
          patterns={patterns}
          onSave={handleSaveShift}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
