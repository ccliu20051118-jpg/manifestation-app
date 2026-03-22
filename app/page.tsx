"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(function() {
    var supabase = createClient();
    supabase.auth.getSession().then(function(result) {
      if (result.data.session) {
        router.push("/dashboard");
      } else {
        setStep("email");
      }
    });
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMsg("請輸入你的 Email");
      return;
    }

    setStep("checking");
    setErrorMsg("");

    try {
      const res = await fetch("/api/check-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (!data.isMember) {
        setStep("not-member");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        console.error("Supabase OTP error:", error);
        setErrorMsg("發送驗證信失敗：" + error.message);
        setStep("error");
        return;
      }

      setStep("magic-link-sent");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("系統連線錯誤，請稍後再試");
      setStep("error");
    }
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-3xl">✨</span>
        </div>
        <h1 className="text-3xl font-bold text-text-main">顯化美麗人生</h1>
        <p className="text-text-sub mt-2 text-sm">Manifesting Beautiful Life</p>
      </div>

      <div className="w-full max-w-sm bg-card-bg rounded-2xl shadow-lg p-8">
        {(step === "email" || step === "error") && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold text-text-main mb-1">歡迎回來</h2>
            <p className="text-text-sub text-sm mb-6">請輸入你在官網註冊的 Email</p>
            <label className="block text-sm text-text-sub mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none text-text-main"
              autoFocus
              required
            />
            {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
            <button type="submit" className="w-full mt-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-md">
              登入
            </button>
            <div className="mt-6 text-center">
              <p className="text-text-sub text-xs">還沒有帳號？</p>
              <a href="https://futurehealingdesign.com/#/portal/signup/free" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark text-sm font-medium mt-1 inline-block">
                前往官網免費註冊 →
              </a>
            </div>
          </form>
        )}

        {step === "checking" && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-sub">正在確認會員身份...</p>
          </div>
        )}

        {step === "magic-link-sent" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h2 className="text-lg font-semibold text-text-main mb-2">請查看你的信箱</h2>
            <p className="text-text-sub text-sm mb-2">我們已經發送一封驗證信到</p>
            <p className="text-primary font-medium mb-4">{email}</p>
            <p className="text-text-sub text-xs mb-6">點擊信中的連結即可登入 ✨</p>
            <button onClick={() => { setStep("email"); setEmail(""); }} className="text-text-sub text-sm hover:text-primary">
              ← 使用其他 Email
            </button>
          </div>
        )}

        {step === "not-member" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌱</span>
            </div>
            <h2 className="text-lg font-semibold text-text-main mb-2">尚未成為會員</h2>
            <p className="text-text-sub text-sm mb-4">使用此 App 需要先在官網註冊為免費會員</p>
            <a href="https://futurehealingdesign.com/#/portal/signup/free" target="_blank" rel="noopener noreferrer" className="inline-block w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-center">
              前往官網免費註冊
            </a>
            <button onClick={() => { setStep("email"); setEmail(""); }} className="mt-4 text-text-sub text-sm hover:text-primary block mx-auto">
              ← 已註冊？重新輸入 Email
            </button>
          </div>
        )}
      </div>

      <p className="text-text-sub text-xs mt-8">© 未來訂製所 Future Healing Design</p>
    </div>
  );
}
