import { useState } from "react";
import type { Staff } from "../types";

interface Props {
  staff: Staff[];
  onChange: (staff: Staff[]) => void;
}

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-teal-500",
];

function avatarColor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return name.slice(0, 2);
}

type Mode = { type: "idle" } | { type: "add" } | { type: "edit"; id: string };

export default function StaffManager({ staff, onChange }: Props) {
  const [mode, setMode] = useState<Mode>({ type: "idle" });
  const [form, setForm] = useState({ lastName: "", firstName: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function startAdd() {
    setForm({ lastName: "", firstName: "" });
    setMode({ type: "add" });
  }

  function startEdit(s: Staff) {
    const [last, first] = s.name.split(" ");
    setForm({ lastName: last ?? "", firstName: first ?? "" });
    setMode({ type: "edit", id: s.id });
  }

  function cancel() {
    setMode({ type: "idle" });
  }

  function saveAdd() {
    const name = `${form.lastName} ${form.firstName}`.trim();
    if (!name) return;
    const id = `staff_${Date.now()}`;
    onChange([...staff, { id, name }]);
    setMode({ type: "idle" });
  }

  function saveEdit(id: string) {
    const name = `${form.lastName} ${form.firstName}`.trim();
    if (!name) return;
    onChange(staff.map((s) => (s.id === id ? { ...s, name } : s)));
    setMode({ type: "idle" });
  }

  function deleteStaff(id: string) {
    onChange(staff.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">スタッフ管理</h2>
          <p className="text-sm text-gray-500 mt-0.5">登録スタッフ {staff.length} 名</p>
        </div>
        <button
          onClick={startAdd}
          disabled={mode.type !== "idle"}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          + スタッフ追加
        </button>
      </div>

      {/* Add form */}
      {mode.type === "add" && (
        <div className="mb-4 p-4 border-2 border-indigo-200 rounded-xl bg-indigo-50">
          <p className="text-sm font-medium text-indigo-700 mb-3">新規スタッフ登録</p>
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">姓</label>
              <input
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="田中"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && saveAdd()}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">名</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="花子"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && saveAdd()}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveAdd}
              disabled={!form.lastName && !form.firstName}
              className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              登録
            </button>
            <button
              onClick={cancel}
              className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Staff list */}
      {staff.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">👤</div>
          <p className="text-sm">スタッフが登録されていません</p>
          <p className="text-xs mt-1">「スタッフ追加」ボタンから登録してください</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {staff.map((s, idx) => (
            <li key={s.id}>
              {mode.type === "edit" && mode.id === s.id ? (
                <div className="p-3 border-2 border-indigo-200 rounded-xl bg-indigo-50">
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">姓</label>
                      <input
                        autoFocus
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(s.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">名</label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(s.id)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(s.id)}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                    >
                      保存
                    </button>
                    <button
                      onClick={cancel}
                      className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 group">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${avatarColor(s.id)}`}
                  >
                    {initials(s.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm">{s.name}</div>
                    <div className="text-xs text-gray-400">No.{String(idx + 1).padStart(2, "0")}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(s)}
                      disabled={mode.type !== "idle"}
                      className="px-3 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(s.id)}
                      disabled={mode.type !== "idle"}
                      className="px-3 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}

              {/* Delete confirm */}
              {deleteConfirm === s.id && (
                <div className="mt-1 ml-13 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <span className="text-sm text-red-700 flex-1">
                    「{s.name}」を削除しますか？シフトデータも削除されます。
                  </span>
                  <button
                    onClick={() => deleteStaff(s.id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                  >
                    削除する
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200"
                  >
                    キャンセル
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
