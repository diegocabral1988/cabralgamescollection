import { withDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return withDb(async (db) => {
    const [quotes, purchases, accessories] = await Promise.all([
      db`SELECT console_id, quote::float8 AS quote, notes FROM quotes`,
      db`SELECT id, console_id, items, price::float8 AS price, note, purchased_at FROM purchases ORDER BY purchased_at`,
      db`SELECT console_id, accessory_index, owned FROM accessory_status WHERE owned = true`,
    ]);
    return { quotes, purchases, accessories };
  });
}
