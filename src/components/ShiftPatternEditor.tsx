import { useState } from "react";
import type { ShiftPattern } from "../types";

interface Props {
  patterns: ShiftPattern[];
  onChange: (patterns: ShiftPattern[]) => void;
}

const COLOR_OPTIONS: { color: string; bgColor: string; label: string }[] = [
  { color: "text-blue-800", bgColor: "bg-blue-100", label: "青" },
  { color: "text-purple-800", bgColor: "bg-purple-100", label: "紫" },
  { color: "text-green-800", bgColor: "bg-green-100", label: "緑" },
  { color: "text-yellow-800", bgColor: "bg-yellow-100", label: "黄" },
  { color: "text-red-800", bgColor: "bg-red-100", label: "赤" },
  { color: "text-gray-600", bgColor: "bg-gray-100", label: "灰" },
];

export default function ShiftPatternEditor({ patterns, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ShiftPattern>>({});

  function startEdit(p: ShiftPattern) {
    setEditingId(p.id);
    setForm({ ...p });
  }

  function saveEdit() {
    if (!editingId || !form.name || !form.label) return;
    const updated = patterns.map((p) =>
      p.id === editingId ? { ...p, ...form } : p
    );
    onChange(updated);
    setEditingId(null);
  }

  function addPattern() {
    const id = `pattern_${Date.now()}`;
    const newP: ShiftPattern = {
      id,
      name: "新パターン",
      label: "新",
      startTime: "09:00",
      endTime: "18:00",
      color: "text-blue-800",
      bgColor: "bg-blue-100",
      hours: 8,
    };
    onChange([...patterns, newP]);
    startEdit(newP);
  }

  function deletePattern(id: string) {
    if (id === "off") return;
    onChange(patterns.filter((p) => p.id !== id));
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">シフトパターン設定</h2>
        <button
          onClick={addPattern}
          className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + 追加
        </button>
      </div>

      <div className="space-y-2">
        {patterns.map((p) =>
          editingId === p.id ? (
            <div key={p.id} className="border border-indigo-300 rounded-lg p-3 bg-indigo-50">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">パターン名</label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={form.name ?? ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">略称（1文字）</label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    maxLength={2}
                    value={form.label ?? ""}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">開始時刻</label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={form.startTime ?? ""}
                    onChange={(e) => {
                      const start = e.target.value;
                      const end = form.endTime ?? "";
                      const hours = calcHours(start, end);
                      setForm({ ...form, startTime: start, hours });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">終了時刻</label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={form.endTime ?? ""}
                    onChange={(e) => {
                      const end = e.target.value;
                      const start = form.startTime ?? "";
                      const hours = calcHours(start, end);
                      setForm({ ...form, endTime: end, hours });
                    }}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">色</label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.bgColor}
                      onClick={() => setForm({ ...form, color: c.color, bgColor: c.bgColor })}
                      className={`w-8 h-8 rounded ${c.bgColor} ${c.color} text-xs font-bold border-2 ${
                        form.bgColor === c.bgColor ? "border-indigo-500" : "border-transparent"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div
              key={p.id}
              className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-block w-8 h-8 rounded text-xs font-bold flex items-center justify-center ${p.bgColor} ${p.color}`}>
                  {p.label}
                </span>
                <div>
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  {p.startTime && (
                    <span className="ml-2 text-xs text-gray-500">
                      {p.startTime}〜{p.endTime}（{p.hours}h）
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(p)}
                  className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                >
                  編集
                </button>
                {p.id !== "off" && (
                  <button
                    onClick={() => deletePattern(p.id)}
                    className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded"
                  >
                    削除
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function calcHours(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
}
