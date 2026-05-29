import { useState } from "react";
import type { ClosedDays } from "../types";

interface Props {
  closedDays: ClosedDays;
  onChange: (closedDays: ClosedDays) => void;
}

const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

// 祝日データ (YYYY-MM-DD -> 名称)
const NATIONAL_HOLIDAYS: Record<string, string> = {
  "2025-01-01": "元日", "2025-01-13": "成人の日",
  "2025-02-11": "建国記念の日", "2025-02-23": "天皇誕生日", "2025-02-24": "振替休日",
  "2025-03-20": "春分の日",
  "2025-04-29": "昭和の日",
  "2025-05-03": "憲法記念日", "2025-05-04": "みどりの日", "2025-05-05": "こどもの日", "2025-05-06": "振替休日",
  "2025-07-21": "海の日",
  "2025-08-11": "山の日",
  "2025-09-15": "敬老の日", "2025-09-23": "秋分の日",
  "2025-10-13": "スポーツの日",
  "2025-11-03": "文化の日", "2025-11-23": "勤労感謝の日", "2025-11-24": "振替休日",
  "2026-01-01": "元日", "2026-01-12": "成人の日",
  "2026-02-11": "建国記念の日", "2026-02-23": "天皇誕生日",
  "2026-03-20": "春分の日",
  "2026-04-29": "昭和の日",
  "2026-05-03": "憲法記念日", "2026-05-04": "みどりの日", "2026-05-05": "こどもの日",
  "2026-07-20": "海の日",
  "2026-08-11": "山の日",
  "2026-09-21": "敬老の日", "2026-09-23": "秋分の日",
  "2026-10-12": "スポーツの日",
  "2026-11-03": "文化の日", "2026-11-23": "勤労感謝の日",
};

export default function HolidayManager({ closedDays, onChange }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState("");

  const ym = `${year}-${String(month).padStart(2, "0")}`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = new Date(year, month - 1, 1).getDay();

  // 当月の休診日
  const monthClosedDays = Object.entries(closedDays)
    .filter(([d]) => d.startsWith(ym))
    .sort(([a], [b]) => a.localeCompare(b));

  // 当月の祝日
  const monthHolidays = Object.entries(NATIONAL_HOLIDAYS)
    .filter(([d]) => d.startsWith(ym));

  function toggle(dateStr: string) {
    if (closedDays[dateStr] !== undefined) {
      const next = { ...closedDays };
      delete next[dateStr];
      onChange(next);
      if (editingDate === dateStr) setEditingDate(null);
    } else {
      const label = NATIONAL_HOLIDAYS[dateStr] ?? "";
      onChange({ ...closedDays, [dateStr]: label });
      setEditingDate(dateStr);
      setLabelInput(label);
    }
  }

  function saveLabel(dateStr: string) {
    onChange({ ...closedDays, [dateStr]: labelInput });
    setEditingDate(null);
  }

  function addAllHolidays() {
    const next = { ...closedDays };
    monthHolidays.forEach(([d, name]) => {
      if (next[d] === undefined) next[d] = name;
    });
    onChange(next);
  }

  function clearMonth() {
    const next = { ...closedDays };
    monthClosedDays.forEach(([d]) => delete next[d]);
    onChange(next);
  }

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  // カレンダーセルを生成 (先頭の空白 + 日付)
  const calCells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // 6行になるよう末尾を埋める
  while (calCells.length % 7 !== 0) calCells.push(null);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">休診日設定</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              クリックで休診日の追加・解除ができます
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-600 text-lg">‹</button>
            <span className="text-sm font-semibold text-gray-800 w-24 text-center">{year}年{month}月</span>
            <button onClick={nextMonth} className="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-600 text-lg">›</button>
          </div>
        </div>

        {/* 操作ボタン */}
        <div className="flex gap-2 mb-4">
          {monthHolidays.length > 0 && (
            <button
              onClick={addAllHolidays}
              className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
            >
              🎌 祝日を一括追加（{monthHolidays.length}日）
            </button>
          )}
          {monthClosedDays.length > 0 && (
            <button
              onClick={clearMonth}
              className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              この月をクリア
            </button>
          )}
        </div>

        {/* カレンダーグリッド */}
        <div className="select-none">
          <div className="grid grid-cols-7 mb-1">
            {DOW_LABELS.map((d, i) => (
              <div
                key={d}
                className={`text-center text-xs font-semibold py-1 ${
                  i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500"
                }`}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {calCells.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isClosed = closedDays[dateStr] !== undefined;
              const isHoliday = NATIONAL_HOLIDAYS[dateStr] !== undefined;
              const dow = (firstDow + day - 1) % 7;
              const isSun = dow === 0;
              const isSat = dow === 6;

              return (
                <button
                  key={dateStr}
                  onClick={() => toggle(dateStr)}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all
                    ${isClosed
                      ? "bg-orange-400 text-white shadow-sm ring-2 ring-orange-300"
                      : isHoliday
                      ? "bg-red-50 text-red-600 hover:bg-orange-100"
                      : isSun
                      ? "bg-red-50 text-red-500 hover:bg-orange-100"
                      : isSat
                      ? "bg-blue-50 text-blue-500 hover:bg-orange-100"
                      : "bg-gray-50 text-gray-700 hover:bg-orange-50"
                    }
                  `}
                  title={isClosed ? `休診: ${closedDays[dateStr] || "（ラベルなし）"}` : isHoliday ? NATIONAL_HOLIDAYS[dateStr] : ""}
                >
                  <span>{day}</span>
                  {isClosed && <span className="text-[9px] leading-none opacity-90">休診</span>}
                  {!isClosed && isHoliday && <span className="text-[8px] leading-none opacity-70">祝</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 凡例 */}
        <div className="flex gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-400 inline-block" />休診日</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50 border border-red-200 inline-block" />祝日</span>
        </div>
      </div>

      {/* 当月の休診日リスト */}
      {monthClosedDays.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {year}年{month}月の休診日（{monthClosedDays.length}日）
          </h3>
          <ul className="space-y-1.5">
            {monthClosedDays.map(([dateStr, label]) => {
              const [, , d] = dateStr.split("-");
              const dow = new Date(dateStr).getDay();
              const isEditing = editingDate === dateStr;
              return (
                <li key={dateStr} className="flex items-center gap-2">
                  <span className="w-24 text-sm text-gray-700 flex-shrink-0">
                    {month}/{Number(d)}（{DOW_LABELS[dow]}）
                  </span>
                  {isEditing ? (
                    <>
                      <input
                        autoFocus
                        className="flex-1 border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="ラベル（例: 元旦、創立記念日）"
                        value={labelInput}
                        onChange={(e) => setLabelInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveLabel(dateStr)}
                      />
                      <button onClick={() => saveLabel(dateStr)} className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded hover:bg-orange-600">保存</button>
                      <button onClick={() => setEditingDate(null)} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200">×</button>
                    </>
                  ) : (
                    <>
                      <span
                        className="flex-1 text-sm text-gray-500 cursor-pointer hover:text-orange-600"
                        onClick={() => { setEditingDate(dateStr); setLabelInput(label); }}
                      >
                        {label || <span className="italic text-gray-300">ラベルなし（クリックで編集）</span>}
                      </span>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded font-medium">休診</span>
                      <button
                        onClick={() => toggle(dateStr)}
                        className="text-xs text-gray-400 hover:text-red-500 px-1"
                        title="解除"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
