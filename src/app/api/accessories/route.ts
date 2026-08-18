import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PUT(req: Request) {
  const { console_id, accessory_index, owned } = await req.json();
  if (typeof console_id !== "string" || !Number.isInteger(accessory_index)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
  const db = sql();
  await db`
    INSERT INTO accessory_status (console_id, accessory_index, owned)
    VALUES (${console_id}, ${accessory_index}, ${!!owned})
    ON CONFLICT (console_id, accessory_index) DO UPDATE SET owned = ${!!owned}`;
  return NextResponse.json({ ok: true });
}
