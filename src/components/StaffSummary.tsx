import type { Staff, ShiftPattern, ShiftData } from "../types";

interface Props {
  year: number;
  month: number;
  staff: Staff[];
  patterns: ShiftPattern[];
  shiftData: ShiftData;
}

export default function StaffSummary({ year, month, staff, patterns, shiftData }: Props) {
  const patternMap = Object.fromEntries(patterns.map((p) => [p.id, p]));
  const daysInMonth = new Date(year, month, 0).getDate();

  const summaries = staff.map((s) => {
    let totalHours = 0;
    let workDays = 0;
    let offDays = 0;
    const patternCount: Record<string, number> = {};

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const slot = shiftData[s.id]?.[dateStr];
      if (!slot) continue;
      const pat = patternMap[slot.patternId];
      if (!pat) continue;

      if (pat.id === "off") {
        offDays++;
      } else {
        workDays++;
        totalHours += pat.hours;
      }
      patternCount[pat.id] = (patternCount[pat.id] ?? 0) + 1;
    }

    return { staff: s, totalHours, workDays, offDays, patternCount };
  });

  const nonOffPatterns = patterns.filter((p) => p.id !== "off");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {year}年{month}月 勤務集計
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700">
                スタッフ
              </th>
              <th className="text-center px-3 py-2 border border-gray-200 font-semibold text-gray-700">
                勤務日数
              </th>
              <th className="text-center px-3 py-2 border border-gray-200 font-semibold text-gray-700">
                合計時間
              </th>
              <th className="text-center px-3 py-2 border border-gray-200 font-semibold text-gray-700">
                休み日数
              </th>
              {nonOffPatterns.map((p) => (
                <th
                  key={p.id}
                  className="text-center px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                >
                  <span className={`inline-block px-2 py-0.5 rounded text-xs ${p.bgColor} ${p.color}`}>
                    {p.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summaries.map(({ staff: s, totalHours, workDays, offDays, patternCount }) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border border-gray-200 font-medium text-gray-800">
                  {s.name}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-center text-gray-700">
                  {workDays}日
                </td>
                <td className="px-3 py-2 border border-gray-200 text-center text-indigo-700 font-semibold">
                  {totalHours}h
                </td>
                <td className="px-3 py-2 border border-gray-200 text-center text-gray-500">
                  {offDays}日
                </td>
                {nonOffPatterns.map((p) => (
                  <td
                    key={p.id}
                    className="px-3 py-2 border border-gray-200 text-center text-gray-600"
                  >
                    {patternCount[p.id] ?? 0}回
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td className="px-3 py-2 border border-gray-200 text-gray-700">合計</td>
              <td className="px-3 py-2 border border-gray-200 text-center text-gray-700">
                {summaries.reduce((a, s) => a + s.workDays, 0)}日
              </td>
              <td className="px-3 py-2 border border-gray-200 text-center text-indigo-700">
                {summaries.reduce((a, s) => a + s.totalHours, 0)}h
              </td>
              <td className="px-3 py-2 border border-gray-200 text-center text-gray-500">
                {summaries.reduce((a, s) => a + s.offDays, 0)}日
              </td>
              {nonOffPatterns.map((p) => (
                <td key={p.id} className="px-3 py-2 border border-gray-200 text-center text-gray-600">
                  {summaries.reduce((a, s) => a + (s.patternCount[p.id] ?? 0), 0)}回
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
