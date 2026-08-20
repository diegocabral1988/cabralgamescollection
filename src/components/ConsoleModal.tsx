"use client";

import { useEffect, useState } from "react";
import { CollectionState, GameConsole } from "@/data/consoles";
import { quoteOf } from "@/lib/collection";
import DevicePhoto from "./DevicePhoto";
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
        <DevicePhoto c={c} size="modal" />
        <h2>{c.name}</h2>
        <p className="m-meta">
          {c.brand} · {c.year} · {c.type} · {c.rarity}
        </p>
        <p className="lore">{c.desc}</p>

        {(c.gen || c.units || c.games || c.tip || c.wall || c.family) && (
          <div className="dossier">
            <div className="d-grid">
              {c.gen && (
                <div>
                  <span className="k">Geração</span>
                  <span className="v">{c.gen}ª</span>
                </div>
              )}
              {c.units && (
                <div>
                  <span className="k">Unidades vendidas</span>
                  <span className="v">{c.units}</span>
                </div>
              )}
              {c.family && (
                <div>
                  <span className="k">Família</span>
                  <span className="v">{c.family}</span>
                </div>
              )}
              <div>
                <span className="k">Acessórios mapeados</span>
                <span className="v">{c.acc.length}</span>
              </div>
              {c.wall && (
                <div>
                  <span className="k">Parede PlayStation</span>
                  <span className="v acc">Painel {c.wall}</span>
                </div>
              )}
            </div>
            {c.games && c.games.length > 0 && (
              <p className="d-games">
                <span className="k">Jogos-chave</span> {c.games.join(" · ")}
              </p>
            )}
            {c.tip && (
              <p className="d-tip">
                <span className="k">Dica de compra</span> {c.tip}
              </p>
            )}
          </div>
        )}

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
