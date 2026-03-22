"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Habit {
  id: string;
  name: string;
  createdAt: string;
}

const dayLabels = ["日", "一", "二", "三", "四", "五", "六"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function HabitPage() {
  const router = useRouter();
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [newHabitName, setNewHabitName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("habits_list");
    if (stored) {
      const list: Habit[] = JSON.parse(stored);
      setHabits(list);
      if (list.length > 0) setSelectedHabit(list[0].id);
    }
  }, []);

  useEffect(() => {
    if (!selectedHabit) return;
    const key = "habit_" + selectedHabit + "_" + currentYear + "_" + (currentMonth + 1);
    const stored = localStorage.getItem(key);
    setCompletions(stored ? JSON.parse(stored) : {});
  }, [selectedHabit, currentYear, currentMonth]);

  function saveCompletions(newCompletions: Record<string, boolean>) {
    if (!selectedHabit) return;
    const key = "habit_" + selectedHabit + "_" + currentYear + "_" + (currentMonth + 1);
    localStorage.setItem(key, JSON.stringify(newCompletions));
    setCompletions(newCompletions);
  }

  function toggleDay(day: number) {
    const dayStr = String(day);
    const updated = { ...completions, [dayStr]: !completions[dayStr] };
    saveCompletions(updated);
  }

  function addHabit() {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    localStorage.setItem("habits_list", JSON.stringify(updated));
    setSelectedHabit(newHabit.id);
    setNewHabitName("");
    setShowAdd(false);
  }

  function deleteHabit(id: string) {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    localStorage.setItem("habits_list", JSON.stringify(updated));
    if (selectedHabit === id) {
      setSelectedHabit(updated.length > 0 ? updated[0].id : null);
    }
  }

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const completedCount = Object.values(completions).filter(Boolean).length;
  const todayStr = String(now.getDate());
  const isCurrentMonth = currentYear === now.getFullYear() && currentMonth === now.getMonth();

  return (
    <div className="max-w-lg mx-auto px-6 pt-6 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push("/dashboard")} className="text-2xl mr-3" aria-label="返回">←</button>
        <h1 className="text-xl font-bold text-text-main">習慣養成</h1>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {habits.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHabit(h.id)}
            className="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors"
            style={{
              backgroundColor: selectedHabit === h.id ? "#7BC2A8" : "#F0F4F2",
              color: selectedHabit === h.id ? "white" : "#2D4A3E",
            }}
          >
            {h.name}
          </button>
        ))}
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-full text-sm whitespace-nowrap"
          style={{ backgroundColor: "#F0F4F2", color: "#7BC2A8" }}
        >
          + 新增
        </button>
      </div>

      {showAdd && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="輸入習慣名稱..."
            className="flex-1 px-4 py-2 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#7BC2A8]"
            style={{ backgroundColor: "#D4EBE3" }}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
          />
          <button onClick={addHabit} className="px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: "#7BC2A8" }}>確定</button>
          <button onClick={() => { setShowAdd(false); setNewHabitName(""); }} className="px-3 py-2 text-text-sub text-sm">取消</button>
        </div>
      )}

      {selectedHabit && habits.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="text-xl text-text-sub px-2">‹</button>
            <span className="text-base font-semibold text-text-main">{currentYear}年{currentMonth + 1}月</span>
            <button onClick={nextMonth} className="text-xl text-text-sub px-2">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayLabels.map((label) => (
              <div key={label} className="text-center text-xs text-text-sub py-1">{label}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={"empty" + i} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const done = completions[String(day)];
              const isToday = isCurrentMonth && String(day) === todayStr;
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className="aspect-square flex items-center justify-center rounded-lg text-sm transition-all"
                  style={{
                    backgroundColor: done ? "#7BC2A8" : isToday ? "#E8F0EC" : "transparent",
                    color: done ? "white" : "#2D4A3E",
                    fontWeight: isToday ? 700 : 400,
                  }}
                >
                  {done ? "✓" : day}
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl" style={{ backgroundColor: "#F0F4F2" }}>
            <div className="flex justify-between text-sm">
              <span className="text-text-sub">本月完成</span>
              <span className="font-semibold" style={{ color: "#7BC2A8" }}>{completedCount} 天</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-sub">完成率</span>
              <span className="font-semibold" style={{ color: "#7BC2A8" }}>
                {daysInMonth > 0 ? Math.round((completedCount / daysInMonth) * 100) : 0}%
              </span>
            </div>
          </div>

          <button
            onClick={() => { if (confirm("確定要刪除這個習慣嗎？")) deleteHabit(selectedHabit); }}
            className="mt-4 text-sm text-red-400 hover:text-red-500 block mx-auto"
          >
            刪除此習慣
          </button>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🌱</p>
          <p className="text-text-sub">還沒有建立任何習慣</p>
          <p className="text-text-sub text-sm mt-1">點擊上方「+ 新增」開始追蹤你的第一個習慣</p>
        </div>
      )}
    </div>
  );
}
