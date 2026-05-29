import type { Staff, ShiftPattern } from "../types";

interface Props {
  staffId: string;
  date: string;
  currentPatternId: string;
  currentConfirmed: boolean;
  staff: Staff[];
  patterns: ShiftPattern[];
  onSave: (staffId: string, date: string, patternId: string, confirmed: boolean) => void;
  onClose: () => void;
}

const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export default function ShiftEditModal({
  staffId,
  date,
  currentPatternId,
  currentConfirmed,
  staff,
  patterns,
  onSave,
  onClose,
}: Props) {
  const staffMember = staff.find((s) => s.id === staffId);
  const [year, month, day] = date.split("-").map(Number);
  const dow = new Date(year, month - 1, day).getDay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-800">シフト変更</h3>
          {currentPatternId && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              currentConfirmed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}>
              {currentConfirmed ? "確定済み" : "仮"}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {staffMember?.name} ／ {month}/{day}（{DOW_LABELS[dow]}）
        </p>

        {/* 確定/仮切り替え（パターンが選択済みのとき） */}
        {currentPatternId && (
          <div className="mb-3 flex gap-2">
            <button
              onClick={() => { onSave(staffId, date, currentPatternId, true); onClose(); }}
              disabled={currentConfirmed}
              className="flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✓ 確定する
            </button>
            <button
              onClick={() => { onSave(staffId, date, currentPatternId, false); onClose(); }}
              disabled={!currentConfirmed}
              className="flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              仮に戻す
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 mb-2">パターンを変えると「仮」で保存</p>

        {/* パターン選択 */}
        <div className="space-y-1.5">
          {patterns.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSave(staffId, date, p.id, false);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                currentPatternId === p.id
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center flex-shrink-0 ${p.bgColor} ${p.color}`}
              >
                {p.label}
              </span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">{p.name}</div>
                {p.startTime && (
                  <div className="text-xs text-gray-500">
                    {p.startTime}〜{p.endTime}（{p.hours}h）
                  </div>
                )}
              </div>
              {currentPatternId === p.id && (
                <span className="ml-auto text-indigo-600 text-xs font-semibold">現在</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
