import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = sql();
  const [quotes, purchases, accessories] = await Promise.all([
    db`SELECT console_id, quote::float8 AS quote, notes FROM quotes`,
    db`SELECT id, console_id, items, price::float8 AS price, note, purchased_at FROM purchases ORDER BY purchased_at`,
    db`SELECT console_id, accessory_index, owned FROM accessory_status WHERE owned = true`,
  ]);
  return NextResponse.json({ quotes, purchases, accessories });
}
