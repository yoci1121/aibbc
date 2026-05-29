import type { Staff, ShiftPattern, ShiftData } from "../types";

interface Props {
  year: number;
  month: number;
  staff: Staff[];
  patterns: ShiftPattern[];
  shiftData: ShiftData;
  onCellClick?: (staffId: string, date: string) => void;
}

const DOW_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export default function ShiftCalendar({
  year,
  month,
  staff,
  patterns,
  shiftData,
  onCellClick,
}: Props) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const patternMap = Object.fromEntries(patterns.map((p) => [p.id, p]));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(year, month - 1, d).getDay();
    return { d, dateStr, dow };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 z-10 bg-gray-50 text-left px-3 py-2 font-semibold text-gray-700 border-b border-r border-gray-200 min-w-[80px]">
                日付
              </th>
              {staff.map((s) => (
                <th
                  key={s.id}
                  className="px-2 py-2 font-semibold text-gray-700 border-b border-r border-gray-200 min-w-[60px] text-center"
                >
                  {s.name.split(" ")[0]}
                  <br />
                  <span className="text-gray-400 font-normal">{s.name.split(" ")[1]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(({ d, dateStr, dow }) => {
              const isSun = dow === 0;
              const isSat = dow === 6;
              const rowBg = isSun
                ? "bg-red-50"
                : isSat
                ? "bg-blue-50"
                : "bg-white";

              return (
                <tr key={dateStr} className={`${rowBg} hover:brightness-95`}>
                  <td className={`sticky left-0 z-10 ${rowBg} px-3 py-1 border-b border-r border-gray-100 font-medium`}>
                    <span className={isSun ? "text-red-600" : isSat ? "text-blue-600" : "text-gray-700"}>
                      {month}/{d}（{DOW_LABELS[dow]}）
                    </span>
                  </td>
                  {staff.map((s) => {
                    const patId = shiftData[s.id]?.[dateStr] ?? "";
                    const pat = patternMap[patId];
                    return (
                      <td
                        key={s.id}
                        className="px-1 py-1 border-b border-r border-gray-100 text-center cursor-pointer"
                        onClick={() => onCellClick?.(s.id, dateStr)}
                        title={pat ? `${pat.name}${pat.startTime ? ` ${pat.startTime}〜${pat.endTime}` : ""}` : ""}
                      >
                        {pat ? (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-7 rounded text-xs font-bold ${pat.bgColor} ${pat.color}`}
                          >
                            {pat.label}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-7 rounded text-xs text-gray-300">
                            ー
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
