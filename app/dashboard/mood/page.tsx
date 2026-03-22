"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const moodEmojis = [
  { emoji: "😊", label: "開心" },
  { emoji: "😌", label: "平靜" },
  { emoji: "😐", label: "普通" },
  { emoji: "😔", label: "低落" },
  { emoji: "😤", label: "煩躁" },
  { emoji: "😢", label: "難過" },
  { emoji: "😰", label: "焦慮" },
  { emoji: "🥰", label: "幸福" },
];

export default function MoodPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [trigger, setTrigger] = useState("");
  const [response, setResponse] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = "mood_" + today;
    const stored = localStorage.getItem(key);
    if (stored) {
      const data = JSON.parse(stored);
      setSelectedMood(data.selectedMood ?? null);
      setTrigger(data.trigger || "");
      setResponse(data.response || "");
      setSaved(true);
    }
  }, [today]);

  function handleSave() {
    const key = "mood_" + today;
    localStorage.setItem(key, JSON.stringify({ selectedMood, trigger, response, date: today }));
    setSaved(true);
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-6 pb-32">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push("/dashboard")} className="text-2xl mr-3" aria-label="返回">←</button>
        <h1 className="text-xl font-bold text-text-main">心情覺察記錄</h1>
      </div>

      <p className="text-text-sub text-sm mb-4">今天的心情如何？選擇最符合的表情</p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {moodEmojis.map((mood, i) => (
          <button
            key={i}
            onClick={() => { setSelectedMood(i); setSaved(false); }}
            className="flex flex-col items-center p-3 rounded-xl transition-all"
            style={{
              backgroundColor: selectedMood === i ? "#D4EBE3" : "#F0F4F2",
              transform: selectedMood === i ? "scale(1.05)" : "scale(1)",
              boxShadow: selectedMood === i ? "0 2px 8px rgba(123,194,168,0.3)" : "none",
            }}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className="text-xs text-text-sub">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-text-main font-medium mb-2">是什麼觸發了這個情緒？</p>
        <textarea
          value={trigger}
          onChange={(e) => { setTrigger(e.target.value); setSaved(false); }}
          placeholder="例如：工作壓力、與朋友聊天、看了一部電影..."
          className="w-full h-24 p-4 rounded-xl border-none text-sm text-text-main resize-none focus:outline-none focus:ring-2 focus:ring-[#7BC2A8]"
          style={{ backgroundColor: "#D4EBE3" }}
        />
      </div>

      <div className="mb-6">
        <p className="text-text-main font-medium mb-2">我可以怎麼回應這個情緒？</p>
        <textarea
          value={response}
          onChange={(e) => { setResponse(e.target.value); setSaved(false); }}
          placeholder="例如：深呼吸、散步、跟朋友聊聊..."
          className="w-full h-24 p-4 rounded-xl border-none text-sm text-text-main resize-none focus:outline-none focus:ring-2 focus:ring-[#7BC2A8]"
          style={{ backgroundColor: "#D4EBE3" }}
        />
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-6">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl text-white font-semibold text-base transition-colors"
            style={{ backgroundColor: saved ? "#9DCAB8" : "#7BC2A8" }}
          >
            {saved ? "✓ 已儲存" : "✓ 完成"}
          </button>
        </div>
      </div>
    </div>
  );
}
