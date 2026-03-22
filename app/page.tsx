"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserName(data.user.email.split("@")[0]);
      }
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const menuItems = [
    { title: "顯化&方法", href: "/dashboard/knowledge" },
    { title: "早晨啟動", href: "/dashboard/morning" },
    { title: "心情覺察記錄", href: "/dashboard/mood" },
    { title: "今日複盤", href: "/dashboard/review" },
    { title: "習慣養成", href: "/dashboard/habit" },
    { title: "睡前感恩", href: "/dashboard/evening" },
    { title: "每週練習足跡", href: "/dashboard/weekly" },
    { title: "我的檔案", href: "/dashboard/profile" },
    { title: "提醒鬧鐘", href: "/dashboard/reminder" },
    { title: "顯化交流社群\n（開發中）", href: "#" },
  ];

  return (
    <div className="max-w-lg mx-auto px-6 pt-8 pb-8">
      <div className="text-center mb-8 mt-4">
        <h1 className="text-2xl font-bold text-text-main">顯化美麗人生</h1>
        {userName && (
          <p className="text-text-sub text-sm mt-2">歡迎回來，{userName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="bg-card-btn rounded-2xl p-5 min-h-[100px] flex items-center justify-center hover:shadow-md transition-all active:scale-[0.98]"
            style={{ opacity: item.href === "#" ? 0.6 : 1 }}
          >
            <span className="text-base font-medium text-text-main text-center whitespace-pre-line">
              {item.title}
            </span>
          </Link>
        ))}
      </div>

      <div className="text-center mb-6">
        
          href="https://futurehealingdesign.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm hover:text-primary-dark"
        >
          前往官網閱讀更多深度文章 →
        </a>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-4 bg-white rounded-xl border border-card-btn text-text-main text-base font-medium hover:bg-gray-50 transition-colors"
      >
        登出
      </button>
    </div>
  );
}
