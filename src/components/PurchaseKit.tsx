"use client";

import { useState } from "react";
import { CollectionState, GameConsole } from "@/data/consoles";
import { boughtSet, fmt, lotsOf, lotsTotal } from "@/lib/collection";

export default function PurchaseKit({
  c,
  state,
  onAdd,
  onDelete,
}: {
  c: GameConsole;
  state: CollectionState;
  onAdd: (items: number[], price: number, note: string) => void;
  onDelete: (id: number) => void;
}) {
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState(false);

  const bought = boughtSet(state, c.id);
  const lots = lotsOf(state, c.id);

  const toggle = (x: number) => {
    const next = new Set(sel);
    if (next.has(x)) next.delete(x);
    else next.add(x);
    setSel(next);
  };

  const add = () => {
    const p = parseFloat(price.replace(",", "."));
    if (!sel.size) {
      alert("Selecione ao menos 1 item do kit.");
      return;
    }
    if (!(p > 0)) {
      alert("Informe o valor pago pelo kit.");
      return;
    }
    onAdd([...sel].sort((a, b) => a - b), p, note.trim());
    setSel(new Set());
    setPrice("");
    setNote("");
    setFeedback(true);
    setTimeout(() => setFeedback(false), 2200);
  };

  return (
    <div className="msec">
      <span className="ml">
        <span className="n">02</span> Registrar compra por kit
      </span>
      <p className="hint">
        Selecione os itens que vieram na compra — um item ou um kit com vários — informe o valor pago
        pelo conjunto e adicione. Itens já comprados aparecem com ✓.
      </p>
      <div className="chips">
        {c.acc.map((a, x) => (
          <button
            key={x}
            type="button"
            className={`chip${bought.has(x) ? " bought" : ""}${sel.has(x) ? " sel" : ""}`}
            aria-pressed={sel.has(x)}
            onClick={() => toggle(x)}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="inrow">
        <div className="inbox">
          <label htmlFor="lot-price">Valor pago pelo kit (R$)</label>
          <input
            id="lot-price"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="inbox wide">
          <label htmlFor="lot-note">Nota da compra — opcional</label>
          <input
            id="lot-note"
            type="text"
            placeholder="Ex: OLX, vendedor João, CIB"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <button className="btn full" onClick={add}>
        Adicionar compra
      </button>
      <span className={`feedback${feedback ? " show" : ""}`}>Compra registrada</span>
      <ul className="lots">
        {lots.map((l) => (
          <li key={l.id}>
            <div>
              <span className="lot-items">{l.items.map((x) => c.acc[x]).join(" + ")}</span>
              <span className="lot-meta">
                {new Date(l.purchased_at).toLocaleDateString("pt-BR")}
                {l.note ? ` · ${l.note}` : ""}
              </span>
            </div>
            <div className="lot-right">
              <span className="lot-price">R$ {fmt(Number(l.price) || 0)}</span>
              <button
                className="lot-del"
                title="Excluir compra"
                onClick={() => {
                  if (confirm("Excluir esta compra?")) onDelete(l.id);
                }}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      {lots.length > 0 && (
        <div className="subtotal">
          <span className="ml">Total investido neste console</span>
          <span className="v">R$ {fmt(lotsTotal(state, c.id))}</span>
        </div>
      )}
    </div>
  );
}
