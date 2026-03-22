import { NextResponse } from "next/server";
import { checkGhostMember } from "@/lib/ghost";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "請輸入 Email" }, { status: 400 });
    }

    const member = await checkGhostMember(email);

    if (member) {
      return NextResponse.json({
        isMember: true,
        name: member.name,
        status: member.status,
      });
    } else {
      return NextResponse.json({ isMember: false });
    }
  } catch (error) {
    console.error("Check member error:", error);
    return NextResponse.json(
      { error: "系統錯誤，請稍後再試" },
      { status: 500 }
    );
  }
}
