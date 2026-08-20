import { NextResponse } from "next/server";
import { DbNotConfigured, ensureSchema, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Diagnóstico: diz se o banco está configurado, acessível e com as tabelas que
 * o site usa. É a primeira página a abrir quando salvar falha.
 */
export async function GET() {
  const hasUrl = !!process.env.DATABASE_URL;
  const hasPassword = !!process.env.SITE_PASSWORD;
  if (!hasUrl) {
    return NextResponse.json({
      database_url: false,
      site_password: hasPassword,
      db: "erro",
      detalhe: new DbNotConfigured().message,
    });
  }
  try {
    await ensureSchema();
    const db = sql();
    const [q] = await db`SELECT count(*)::int AS n FROM quotes`;
    const [p] = await db`SELECT count(*)::int AS n FROM purchases`;
    const [a] = await db`SELECT count(*)::int AS n FROM accessory_status WHERE owned = true`;
    return NextResponse.json({
      database_url: true,
      site_password: hasPassword,
      db: "ok",
      cotacoes: q.n,
      compras: p.n,
      acessorios: a.n,
    });
  } catch (e) {
    return NextResponse.json({
      database_url: true,
      site_password: hasPassword,
      db: "erro",
      detalhe: e instanceof Error ? e.message : String(e),
    });
  }
}
