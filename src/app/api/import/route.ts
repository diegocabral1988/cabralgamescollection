import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Importa dados vindos do localStorage (chaves cgc_*) do tracker HTML original.
export async function POST(req: Request) {
  const { quotes = [], purchases = [], accessories = [] } = await req.json();
  const db = sql();
  for (const q of quotes) {
    if (typeof q.console_id !== "string") continue;
    await db`
      INSERT INTO quotes (console_id, quote, notes, updated_at)
      VALUES (${q.console_id}, ${Number(q.quote) || 0}, ${String(q.notes ?? "")}, now())
      ON CONFLICT (console_id) DO UPDATE SET quote = EXCLUDED.quote, notes = EXCLUDED.notes, updated_at = now()`;
  }
  for (const p of purchases) {
    if (typeof p.console_id !== "string" || !Array.isArray(p.items)) continue;
    await db`
      INSERT INTO purchases (console_id, items, price, note)
      VALUES (${p.console_id}, ${p.items.map(Number)}, ${Number(p.price) || 0}, ${String(p.note ?? "")})`;
  }
  for (const a of accessories) {
    if (typeof a.console_id !== "string" || !Number.isInteger(a.accessory_index)) continue;
    await db`
      INSERT INTO accessory_status (console_id, accessory_index, owned)
      VALUES (${a.console_id}, ${a.accessory_index}, ${!!a.owned})
      ON CONFLICT (console_id, accessory_index) DO UPDATE SET owned = ${!!a.owned}`;
  }
  return NextResponse.json({ ok: true });
}
