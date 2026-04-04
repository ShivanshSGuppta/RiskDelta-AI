import { NextResponse } from "next/server";
import { clearSession } from "@/server/auth/session";

export async function GET(request: Request) {
  await clearSession();
  return NextResponse.redirect(new URL("/signin", request.url));
}

export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
