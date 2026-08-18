import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

// Diagnóstico: confirma se o banco está configurado e acessível.
export async function GET() {
  const hasUrl = !!process.env.DATABASE_URL;
  const hasPassword = !!process.env.SITE_PASSWORD;
  let db = "erro";
  let consoles = 0;
  if (hasUrl) {
    try {
      const [row] = await sql()`SELECT count(*)::int AS n FROM consoles`;
      consoles = row.n;
      db = "ok";
    } catch (e) {
      db = `erro: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return NextResponse.json({ database_url: hasUrl, site_password: hasPassword, db, consoles });
}
