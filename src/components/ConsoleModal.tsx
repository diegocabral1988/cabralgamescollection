"use client";

import { useEffect, useState } from "react";
import { CollectionState, GameConsole } from "@/data/consoles";
import { quoteOf } from "@/lib/collection";
import PurchaseKit from "./PurchaseKit";
import AccessoryChecklist from "./AccessoryChecklist";

export default function ConsoleModal({
  c,
  state,
  onClose,
  onSaveQuote,
  onAddPurchase,
  onDeletePurchase,
  onToggleAccessory,
}: {
  c: GameConsole;
  state: CollectionState;
  onClose: () => void;
  onSaveQuote: (quote: number, notes: string) => void;
  onAddPurchase: (items: number[], price: number, note: string) => void;
  onDeletePurchase: (id: number) => void;
  onToggleAccessory: (index: number, owned: boolean) => void;
}) {
  const saved = quoteOf(state, c.id);
  const [quote, setQuote] = useState(saved && Number(saved.quote) > 0 ? String(saved.quote) : "");
  const [notes, setNotes] = useState(saved?.notes ?? "");
  const [feedback, setFeedback] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    onSaveQuote(parseFloat(quote.replace(",", ".")) || 0, notes);
    setFeedback(true);
    setTimeout(() => setFeedback(false), 2200);
  };

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label={c.name}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button className="close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <h2>{c.name}</h2>
        <p className="m-meta">
          {c.brand} · {c.year} · {c.type} · {c.rarity}
        </p>
        <p className="lore">{c.desc}</p>

        <div className="msec">
          <span className="ml">
            <span className="n">01</span> Cotação de referência
          </span>
          <div className="inrow">
            <div className="inbox">
              <label htmlFor="in-quote">Melhor cotação do conjunto (R$)</label>
              <input
                id="in-quote"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
              />
            </div>
            <div className="inbox wide">
              <label htmlFor="in-notes">Notas — vendedor, estado, links</label>
              <textarea id="in-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <button className="btn ghost full" onClick={save}>
            Salvar cotação e notas
          </button>
          <span className={`feedback${feedback ? " show" : ""}`}>Salvo</span>
        </div>

        <PurchaseKit c={c} state={state} onAdd={onAddPurchase} onDelete={onDeletePurchase} />
        <AccessoryChecklist c={c} state={state} onToggle={onToggleAccessory} />
      </div>
    </div>
  );
}
