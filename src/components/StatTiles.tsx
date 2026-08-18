"use client";

import { CollectionState, DB } from "@/data/consoles";
import { accProgress, fmt, lotsTotal, quoteOf } from "@/lib/collection";

export default function StatTiles({ state }: { state: CollectionState }) {
  let quotes = 0,
    invested = 0,
    owned = 0,
    accSum = 0;
  DB.forEach((c) => {
    quotes += Number(quoteOf(state, c.id)?.quote) || 0;
    const t = lotsTotal(state, c.id);
    invested += t;
    if (t > 0) owned++;
    accSum += accProgress(state, c);
  });

  return (
    <div className="stats">
      <div className="stat">
        <div className="num">{DB.length}</div>
        <span className="ml">Consoles no catálogo</span>
      </div>
      <div className="stat">
        <div className="num ok">{owned}</div>
        <span className="ml">Com itens adquiridos</span>
      </div>
      <div className="stat">
        <div className="num acc">{fmt(quotes)}</div>
        <span className="ml">Total em cotações — R$</span>
      </div>
      <div className="stat">
        <div className="num ok">{fmt(invested)}</div>
        <span className="ml">Total investido — R$</span>
      </div>
      <div className="stat">
        <div className="num">{Math.round(accSum / DB.length)}%</div>
        <span className="ml">Acessórios completos</span>
      </div>
    </div>
  );
}
