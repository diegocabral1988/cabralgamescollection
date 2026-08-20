import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export class DbNotConfigured extends Error {
  constructor() {
    super(
      "Banco não configurado: defina DATABASE_URL nas variáveis de ambiente do projeto (Vercel → Settings → Environment Variables) e refaça o deploy."
    );
  }
}

export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DbNotConfigured();
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

/**
 * Cria as tabelas se ainda não existirem. Roda uma vez por instância, de modo
 * que um banco Neon vazio passa a funcionar sem migração manual.
 */
export async function ensureSchema() {
  if (!schemaReady) {
    const db = sql();
    schemaReady = (async () => {
      await db`
        CREATE TABLE IF NOT EXISTS quotes (
          console_id text PRIMARY KEY,
          quote numeric NOT NULL DEFAULT 0,
          notes text NOT NULL DEFAULT '',
          updated_at timestamptz NOT NULL DEFAULT now()
        )`;
      await db`
        CREATE TABLE IF NOT EXISTS purchases (
          id serial PRIMARY KEY,
          console_id text NOT NULL,
          items integer[] NOT NULL DEFAULT '{}',
          price numeric NOT NULL DEFAULT 0,
          note text NOT NULL DEFAULT '',
          purchased_at timestamptz NOT NULL DEFAULT now()
        )`;
      await db`
        CREATE TABLE IF NOT EXISTS accessory_status (
          console_id text NOT NULL,
          accessory_index integer NOT NULL,
          owned boolean NOT NULL DEFAULT false,
          PRIMARY KEY (console_id, accessory_index)
        )`;
    })().catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  return schemaReady;
}

/**
 * Envolve um handler de rota: garante o schema e transforma falha de banco em
 * resposta legível, em vez de um 500 sem explicação.
 */
export async function withDb<T>(run: (db: ReturnType<typeof sql>) => Promise<T>) {
  try {
    const db = sql();
    await ensureSchema();
    return NextResponse.json(await run(db));
  } catch (e) {
    if (e instanceof DbNotConfigured) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const detail = e instanceof Error ? e.message : String(e);
    console.error("Falha de banco:", detail);
    return NextResponse.json(
      { error: `Falha ao falar com o banco: ${detail}` },
      { status: 500 }
    );
  }
}
