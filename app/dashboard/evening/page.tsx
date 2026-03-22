"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const defaultGratitudes = [
  "感謝今天平安順利的一天",
  "感謝身邊愛我的人",
  "感謝自己今天的努力",
  "感謝宇宙帶給我的學習機會",
  "感謝我擁有健康的身體",
  "感謝今天遇到的每一個人",
  "感謝生命中所有的豐盛",
  "感謝自己願意持續成長",
];

export default function EveningPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [customText, setCustomText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = "evening_" + today;
    const stored = localStorage.getItem(key);
    if (stored) {
      const data = JSON.parse(stored);
      setChecked(data.checked || {});
      setCustomText(data.customText || "");
      setSaved(true);
    }
  }, [today]);

  function toggleCheck(index: number) {
    setSaved(false);
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  function handleSave() {
    const key = "evening_" + today;
    localStorage.setItem(key, JSON.stringify({ checked, customText, date: today }));
    setSaved(true);
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-6 pb-32">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push("/dashboard")} className="text-2xl mr-3" aria-label="返回">←</button>
        <h1 className="text-xl font-bold text-text-main">睡前感恩</h1>
      </div>

      <p className="text-text-sub text-sm mb-4">在一天結束之前，感謝今天發生的一切</p>

      <div className="space-y-3 mb-6">
        {defaultGratitudes.map((text, i) => (
          <label
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors"
            style={{ backgroundColor: checked[i] ? "#D4EBE3" : "#F0F4F2" }}
          >
            <input
              type="checkbox"
              checked={!!checked[i]}
              onChange={() => toggleCheck(i)}
              className="mt-1 w-5 h-5 accent-[#7BC2A8] flex-shrink-0"
            />
            <span className="text-text-main text-sm leading-relaxed">{text}</span>
          </label>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-text-main font-medium mb-2">今天我還想感謝...</p>
        <textarea
          value={customText}
          onChange={(e) => { setCustomText(e.target.value); setSaved(false); }}
          placeholder="寫下你今天特別想感恩的事..."
          className="w-full h-32 p-4 rounded-xl border-none text-sm text-text-main resize-none focus:outline-none focus:ring-2 focus:ring-[#7BC2A8]"
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
