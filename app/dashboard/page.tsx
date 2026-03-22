"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(function() {
    var supabase = createClient();
    supabase.auth.getUser().then(function(res) {
      if (res.data.user && res.data.user.email) {
        setUserName(res.data.user.email.split("@")[0]);
      }
    });
  }, []);

  function handleLogout() {
    var supabase = createClient();
    supabase.auth.signOut().then(function() {
      router.push("/login");
    });
  }

  var menuItems = [
    { title: "顯化&方法", href: "/dashboard/knowledge" },
    { title: "早晨啟動", href: "/dashboard/morning" },
    { title: "心情覺察記錄", href: "/dashboard/mood" },
    { title: "今日複盤", href: "/dashboard/review" },
    { title: "睡前感恩", href: "/dashboard/evening" },
    { title: "每週練習足跡", href: "/dashboard/weekly" },
    { title: "我的檔案", href: "/dashboard/profile" },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32, marginTop: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#2D4A3E" }}>
          顯化美麗人生
        </h1>
        {userName ? (
          <p style={{ color: "#687076", fontSize: 14, marginTop: 8 }}>歡迎回來，{userName}</p>
        ) : null}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {menuItems.map(function(item) {
          return (
            <Link
              key={item.title}
              href={item.href}
              style={{
                backgroundColor: "#C2D8D0",
                borderRadius: 16,
                padding: 20,
                minHeight: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 500, color: "#2D4A3E", textAlign: "center" }}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <a
          href="https://futurehealingdesign.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#7BC2A8", fontSize: 14 }}
        >
          前往官網閱讀更多深度文章 →
        </a>
      </div>

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: 16,
          backgroundColor: "#FFFFFF",
          border: "1px solid #C2D8D0",
          borderRadius: 12,
          color: "#2D4A3E",
          fontSize: 16,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        登出
      </button>
    </div>
  );
}
