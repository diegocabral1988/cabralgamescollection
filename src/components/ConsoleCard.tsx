"use client";

import { useEffect, useRef, useState } from "react";
import { CollectionState, GameConsole } from "@/data/consoles";
import { accProgress, fmt, lotsTotal, pad, quoteOf } from "@/lib/collection";

export default function ConsoleCard({
  c,
  index,
  state,
  onOpen,
}: {
  c: GameConsole;
  index: number;
  state: CollectionState;
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setOn(true);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const invested = lotsTotal(state, c.id);
  const quote = Number(quoteOf(state, c.id)?.quote) || 0;
  const progress = accProgress(state, c);

  return (
    <button
      ref={ref}
      className={`card${on ? " on" : ""}`}
      style={{ transitionDelay: `${Math.min(index, 10) * 40}ms` }}
      onClick={() => onOpen(c.id)}
    >
      <span className="idx">{pad(index + 1)}</span>
      <h3>{c.name}</h3>
      <p className="meta">
        {c.brand} · {c.year}
      </p>
      <p className="desc">{c.desc}</p>
      <div className="tags">
        <span className="tag">{c.type}</span>
        <span className="tag">{c.rarity}</span>
        {c.fav && <span className="tag fav">Favorito</span>}
        {invested > 0 ? (
          <span className="tag own">Adquirido</span>
        ) : quote > 0 ? (
          <span className="tag quo">Cotado</span>
        ) : null}
      </div>
      <div className="rows">
        {quote > 0 && (
          <div className="info-row">
            <span className="k">Cotação</span>
            <span className="v acc">R$ {fmt(quote)}</span>
          </div>
        )}
        {invested > 0 && (
          <div className="info-row">
            <span className="k">Investido</span>
            <span className="v ok">R$ {fmt(invested)}</span>
          </div>
        )}
        <div className="info-row">
          <span className="k">Acessórios</span>
          <span className="v">{progress}%</span>
        </div>
      </div>
      <div className="pline">
        <i style={{ width: `${progress}%` }} />
      </div>
    </button>
  );
}
