import { NextResponse } from "next/server";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.SITE_PASSWORD;
  const url = new URL(req.url);
  if (expected && password === expected) {
    const res = NextResponse.redirect(new URL("/", url.origin), 303);
    res.cookies.set("cgc_auth", await sha256(expected), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return res;
  }
  return NextResponse.redirect(new URL("/login?erro=1", url.origin), 303);
}
