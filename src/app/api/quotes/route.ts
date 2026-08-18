import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PUT(req: Request) {
  const { console_id, quote, notes } = await req.json();
  if (typeof console_id !== "string") {
    return NextResponse.json({ error: "console_id inválido" }, { status: 400 });
  }
  const db = sql();
  await db`
    INSERT INTO quotes (console_id, quote, notes, updated_at)
    VALUES (${console_id}, ${Number(quote) || 0}, ${String(notes ?? "")}, now())
    ON CONFLICT (console_id)
    DO UPDATE SET quote = EXCLUDED.quote, notes = EXCLUDED.notes, updated_at = now()`;
  return NextResponse.json({ ok: true });
}
