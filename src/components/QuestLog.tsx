"use client";

import { CollectionState, DB, totalAccessories } from "@/data/consoles";
import { lotsTotal, ownedSet, pad } from "@/lib/collection";

// A coleção como um jogo: fases da missão e progresso geral.
export default function QuestLog({ state }: { state: CollectionState }) {
  const consolesOwned = DB.filter((c) => lotsTotal(state, c.id) > 0).length;
  const accOwned = DB.reduce((s, c) => s + ownedSet(state, c.id).size, 0);
  const quoted = state.quotes.filter((q) => Number(q.quote) > 0).length;
  const pct = Math.round((accOwned / totalAccessories) * 100);

  const steps = [
    { label: "Cotar o acervo", done: quoted, total: DB.length },
    { label: "Adquirir consoles", done: consolesOwned, total: DB.length },
    { label: "Completar acessórios", done: accOwned, total: totalAccessories },
    { label: "Ligar tudo nas TVs", done: 0, total: DB.length },
  ];

  return (
    <section className="quest" aria-label="Progresso da missão">
      <div className="q-head">
        <h2 className="q-title">
          <span className="n">QUEST</span>MISSÃO PRINCIPAL — A COLEÇÃO COMPLETA
        </h2>
        <span className="ml mono">{pct}% COMPLETO</span>
      </div>
      <div className="qbar">
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="q-steps">
        {steps.map((s, i) => (
          <div className="q-step" key={s.label}>
            <span className={`s-num${s.done >= s.total && s.total > 0 ? " done" : ""}`}>
              LV.{pad(i + 1)} — {s.done}/{s.total}
            </span>
            <div className="s-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
