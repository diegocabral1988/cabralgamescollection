import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Registrar compra por kit: cria o lote e marca os itens como possuídos.
export async function POST(req: Request) {
  const { console_id, items, price, note } = await req.json();
  if (typeof console_id !== "string" || !Array.isArray(items) || !items.length || !(Number(price) > 0)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
  const idx = items.map(Number).filter((n) => Number.isInteger(n) && n >= 0);
  const db = sql();
  const [row] = await db`
    INSERT INTO purchases (console_id, items, price, note)
    VALUES (${console_id}, ${idx}, ${Number(price)}, ${String(note ?? "")})
    RETURNING id, console_id, items, price::float8 AS price, note, purchased_at`;
  for (const i of idx) {
    await db`
      INSERT INTO accessory_status (console_id, accessory_index, owned)
      VALUES (${console_id}, ${i}, true)
      ON CONFLICT (console_id, accessory_index) DO UPDATE SET owned = true`;
  }
  return NextResponse.json(row);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }
  const db = sql();
  await db`DELETE FROM purchases WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
