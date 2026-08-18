// Semeia a tabela consoles a partir do catálogo em src/data/consoles.ts.
// Uso: DATABASE_URL=... node --experimental-strip-types scripts/seed.ts
import { neon } from "@neondatabase/serverless";
import { DB } from "../src/data/consoles.ts";

const db = neon(process.env.DATABASE_URL!);
for (const c of DB) {
  await db`
    INSERT INTO consoles (id, name, brand, year, type, rarity, description, fav, acc)
    VALUES (${c.id}, ${c.name}, ${c.brand}, ${c.year}, ${c.type}, ${c.rarity}, ${c.desc}, ${!!c.fav}, ${c.acc})
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, brand = EXCLUDED.brand, year = EXCLUDED.year,
      type = EXCLUDED.type, rarity = EXCLUDED.rarity, description = EXCLUDED.description,
      fav = EXCLUDED.fav, acc = EXCLUDED.acc`;
}
const [{ count }] = await db`SELECT count(*)::int AS count FROM consoles`;
console.log(`Seed OK — ${count} consoles no banco.`);
