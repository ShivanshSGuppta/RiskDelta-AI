import { NextResponse } from "next/server";
import { clearSession } from "@/server/auth/session";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
