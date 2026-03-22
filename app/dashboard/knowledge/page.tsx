"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const categoryIcons = { "what-is-manifestation": "🌟", "how-to-manifest": "🎯", "how-to-heal": "💚", "how-to-grow": "🌱" };

export default function KnowledgePage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch("/knowledge.json").then(r => r.json()).then(setData); }, []);
  if (!data) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div></div>;
  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-8">
      <h1 className="text-2xl font-bold text-text-main mb-2">📚 知識模組</h1>
      <p className="text-text-sub text-sm mb-8">療癒與顯化的智慧，一步步帶你認識自己</p>
      <div className="space-y-4">
        {data.categories.sort((a, b) => a.order - b.order).map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{categoryIcons[cat.id] || "📖"}</span>
                <div><h2 className="font-semibold text-text-main text-lg">{cat.title}</h2><p className="text-text-sub text-xs">{cat.articles.length} 篇文章</p></div>
              </div>
              <div className="space-y-2">
                {cat.articles.sort((a, b) => a.order - b.order).map((art, i) => (
                  <Link key={art.id} href={`/dashboard/knowledge/${cat.id}/${art.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 group">
                    <span className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">{i + 1}</span>
                    <span className="text-text-main text-sm group-hover:text-primary">{art.title}</span>
                    <span className="ml-auto text-gray-300 group-hover:text-primary">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
