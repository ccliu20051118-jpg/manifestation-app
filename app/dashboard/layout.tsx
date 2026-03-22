"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "首頁", icon: "🏠" },
  { href: "/dashboard/knowledge", label: "知識", icon: "📚" },
  { href: "/dashboard/practice", label: "練習", icon: "🧘" },
  { href: "/dashboard/profile", label: "我的", icon: "👤" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-4">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center py-1 px-3 rounded-lg ${isActive ? "text-primary" : "text-text-sub hover:text-primary"}`}>
                <span className="text-xl mb-0.5">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
