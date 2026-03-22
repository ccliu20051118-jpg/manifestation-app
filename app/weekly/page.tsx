"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const activities = [
  { key: "morning", label: "早晨啟動", emoji: "☀️" },
  { key: "mood", label: "心情覺察", emoji: "💭" },
  { key: "review", label: "今日複盤", emoji: "✍️" },
  { key: "evening", label: "睡前感恩", emoji: "🌙" },
  { key: "habit", label: "習慣養成", emoji: "✅" },
];

function getWeekDates(): string[] {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

const dayLabels = ["一", "二", "三", "四", "五", "六", "日"];

export default function WeeklyPage() {
  const router = useRouter();
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [completionData, setCompletionData] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    const dates = getWeekDates();
    setWeekDates(dates);

    const data: Record<string, Record<string, boolean>> = {};
    dates.forEach((date) => {
      data[date] = {};
      activities.forEach((act) => {
        const stored = localStorage.getItem(act.key + "_" + date);
        data[date][act.key] = !!stored;
      });
    });
    setCompletionData(data);
  }, []);

  function getWeekTotal(actKey: string): number {
    return weekDates.filter((d) => completionData[d]?.[actKey]).length;
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-6 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push("/dashboard")} className="text-2xl mr-3" aria-label="返回">←</button>
        <h1 className="text-xl font-bold text-text-main">每週練習足跡</h1>
      </div>

      <p className="text-text-sub text-sm mb-6">
        本週 {weekDates[0]?.slice(5)} ~ {weekDates[6]?.slice(5)} 的練習紀錄
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 pr-2 text-text-sub font-medium">活動</th>
              {dayLabels.map((label, i) => (
                <th key={i} className="text-center py-2 px-1 text-text-sub font-medium w-9">{label}</th>
              ))}
              <th className="text-center py-2 pl-2 text-text-sub font-medium">合計</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act) => (
              <tr key={act.key} className="border-t" style={{ borderColor: "#E8F0EC" }}>
                <td className="py-3 pr-2">
                  <span className="text-sm">{act.emoji} {act.label}</span>
                </td>
                {weekDates.map((date, i) => (
                  <td key={i} className="text-center py-3 px-1">
                    {completionData[date]?.[act.key] ? (
                      <span className="text-lg" style={{ color: "#7BC2A8" }}>●</span>
                    ) : (
                      <span className="text-lg text-gray-300">○</span>
                    )}
                  </td>
                ))}
                <td className="text-center py-3 pl-2 font-semibold" style={{ color: "#7BC2A8" }}>
                  {getWeekTotal(act.key)}/7
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: "#F0F4F2" }}>
        <p className="text-text-main font-medium mb-2">本週總結</p>
        <p className="text-text-sub text-sm">
          {(() => {
            const total = activities.reduce((sum, act) => sum + getWeekTotal(act.key), 0);
            const max = activities.length * 7;
            const pct = max > 0 ? Math.round((total / max) * 100) : 0;
            if (pct >= 80) return "太棒了！你這週非常認真地在練習，繼續保持！";
            if (pct >= 50) return "很好的進展！你正在養成好習慣，再多一點堅持！";
            if (pct > 0) return "已經踏出第一步了！每天多做一點點，就會越來越好。";
            return "新的一週開始了，讓我們一起從今天開始練習吧！";
          })()}
        </p>
      </div>
    </div>
  );
}
