"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (token_hash && type) {
      const supabase = createClient();
      supabase.auth.verifyOtp({ token_hash: token_hash, type: type as any }).then(function(result) {
        if (!result.error) {
          router.push("/dashboard");
        } else {
          router.push("/login?error=auth_failed");
        }
      });
    } else {
      const supabase = createClient();
      supabase.auth.getSession().then(function(result) {
        if (result.data.session) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      });
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F9F7" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: "#7BC2A8" }}></div>
        <p style={{ color: "#687076" }}>載入中...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F9F7" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: "#7BC2A8" }}></div>
          <p style={{ color: "#687076" }}>載入中...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
