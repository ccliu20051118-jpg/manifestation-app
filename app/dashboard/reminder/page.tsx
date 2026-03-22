"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Reminder {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

const defaultReminders: Reminder[] = [
  { id: "morning", label: "早晨啟動", time: "07:00", enabled: false },
  { id: "mood", label: "心情覺察", time: "12:00", enabled: false },
  { id: "review", label: "今日複盤", time: "20:00", enabled: false },
  { id: "evening", label: "睡前感恩", time: "22:00", enabled: false },
];

export default function ReminderPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);

  useEffect(() => {
    const stored = localStorage.getItem("reminders");
    if (stored) setReminders(JSON.parse(stored));
  }, []);

  function updateReminder(id: string, updates: Partial<Reminder>) {
    const updated = reminders.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-6 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push("/dashboard")} className="text-2xl mr-3" aria-label="返回">←</button>
        <h1 className="text-xl font-bold text-text-main">提醒鬧鐘</h1>
      </div>

      <p className="text-text-sub text-sm mb-6">設定每日提醒，幫助你養成練習的習慣</p>

      <div className="space-y-4">
        {reminders.map((r) => (
          <div key={r.id} className="p-4 rounded-xl" style={{ backgroundColor: "#F0F4F2" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-main font-medium">{r.label}</span>
              <button
                onClick={() => updateReminder(r.id, { enabled: !r.enabled })}
                className="w-12 h-7 rounded-full transition-colors relative"
                style={{ backgroundColor: r.enabled ? "#7BC2A8" : "#D1D5DB" }}
              >
                <span
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-sm"
                  style={{ left: r.enabled ? "calc(100% - 26px)" : "2px" }}
                />
              </button>
            </div>
            <input
              type="time"
              value={r.time}
              onChange={(e) => updateReminder(r.id, { time: e.target.value })}
              className="w-full px-4 py-2 rounded-lg text-sm text-text-main border-none focus:outline-none focus:ring-2 focus:ring-[#7BC2A8]"
              style={{ backgroundColor: "#D4EBE3" }}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: "#FFF8E7" }}>
        <p className="text-text-main text-sm">
          提示：目前提醒功能會在你下次打開 App 時顯示。未來版本將支援推送通知，即使沒開 App 也能收到提醒。
        </p>
      </div>
    </div>
  );
}
