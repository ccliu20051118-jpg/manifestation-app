"use client";
import Link from "next/link";

export default function PracticePage() {
  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <h1 className="text-2xl font-bold text-text-main mb-2">🧘 每日練習</h1>
      <p className="text-text-sub text-sm mb-8">選擇你的練習</p>
      <div className="space-y-4">
        <Link href="/dashboard/practice" className="block bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 hover:shadow-md">
          <span className="text-3xl block mb-3">🌅</span>
          <h2 className="font-semibold text-text-main text-lg">晨間練習</h2>
          <p className="text-text-sub text-sm mt-1">設定今天的意圖，用正向的心態開始新的一天</p>
        </Link>
        <Link href="/dashboard/practice" className="block bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 hover:shadow-md">
          <span className="text-3xl block mb-3">🌙</span>
          <h2 className="font-semibold text-text-main text-lg">晚間回顧</h2>
          <p className="text-text-sub text-sm mt-1">回顧今天，感恩與反思，為明天充電</p>
        </Link>
      </div>
    </div>
  );
}
