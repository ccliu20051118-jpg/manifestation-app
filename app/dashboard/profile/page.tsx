"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <h1 className="text-2xl font-bold text-text-main mb-8">👤 我的帳號</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-2xl">✨</span></div>
          <div>
            <p className="text-text-main font-semibold">{email ? email.split("@")[0] : ""}</p>
            <p className="text-text-sub text-sm">{email}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <a href="https://futurehealingdesign.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50">
          <span className="text-text-main text-sm">🌐 前往官網</span><span className="text-gray-300">→</span>
        </a>
        <a href="https://readmoo.com/book/210436297000101" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 hover:bg-gray-50">
          <span className="text-text-main text-sm">📖 購買電子書</span><span className="text-gray-300">→</span>
        </a>
      </div>
      <button onClick={handleLogout} className="w-full py-3 text-red-400 text-sm hover:text-red-500">登出帳號</button>
      <p className="text-center text-text-sub text-xs mt-8">© 未來訂製所 Future Healing Design</p>
    </div>
  );
}
