"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const defaultAffirmations = [
  "今天的我值得被愛",
  "我選擇相信自己的力量",
  "我允許美好的事物流向我",
  "今天我會帶著感恩的心前進",
  "我正在成為更好的自己",
  "宇宙正在為我安排最好的",
  "我的內在充滿平靜與喜悅",
  "我相信一切都會在最好的時刻發生",
];

export default function MorningPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [customText, setCustomText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = "morning_" + today;
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
    const key = "morning_" + today;
    localStorage.setItem(key, JSON.stringify({ checked, customText, date: today }));
    setSaved(true);
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-6 pb-32">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push("/dashboard")} className="text-2xl mr-3" aria-label="返回">←</button>
        <h1 className="text-xl font-bold text-text-main">早晨啟動</h1>
      </div>

      <p className="text-text-sub text-sm mb-4">選擇今天想對自己說的話，開啟美好的一天</p>

      <div className="space-y-3 mb-6">
        {defaultAffirmations.map((text, i) => (
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
        <p className="text-text-main font-medium mb-2">今天我想顯化...</p>
        <textarea
          value={customText}
          onChange={(e) => { setCustomText(e.target.value); setSaved(false); }}
          placeholder="寫下你今天想要顯化的事物..."
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
