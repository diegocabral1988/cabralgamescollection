"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { CollectionState, DB } from "@/data/consoles";
import { emptyState, lotsTotal, pad, quoteOf } from "@/lib/collection";
import Header from "./Header";
import QuestLog from "./QuestLog";
import StatTiles from "./StatTiles";
import Filters, { FilterState, initialFilters } from "./Filters";
import ConsoleCard from "./ConsoleCard";
import ConsoleModal from "./ConsoleModal";
import ProjectBoard from "./ProjectBoard";

// Toda gravação passa por aqui: se o servidor falhar, avisa e desfaz o optimistic update.
async function send(url: string, init: RequestInit) {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    alert("Sem conexão com o servidor — a alteração NÃO foi salva.");
    throw new Error("network error");
  }
  if (!res.ok) {
    alert(`Falha ao salvar (HTTP ${res.status}) — a alteração NÃO foi salva. Verifique /api/health.`);
    throw new Error(`save failed: ${res.status}`);
  }
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Falha ao carregar dados");
    return r.json();
  });

function readLocalBackup() {
  const quotes: { console_id: string; quote: number; notes: string }[] = [];
  const purchases: { console_id: string; items: number[]; price: number; note: string }[] = [];
  const accessories: { console_id: string; accessory_index: number; owned: boolean }[] = [];
  try {
    DB.forEach((c) => {
      const q = parseFloat(localStorage.getItem(`cgc_quote_${c.id}`) || "");
      const n = localStorage.getItem(`cgc_notes_${c.id}`) || "";
      if (q > 0 || n) quotes.push({ console_id: c.id, quote: q > 0 ? q : 0, notes: n });
      const lots = JSON.parse(localStorage.getItem(`cgc_lots_${c.id}`) || "[]");
      if (Array.isArray(lots)) {
        lots.forEach((l) =>
          purchases.push({
            console_id: c.id,
            items: (l.items || []).map(Number),
            price: Number(l.price) || 0,
            note: String(l.note || ""),
          })
        );
      }
      c.acc.forEach((_, x) => {
        if (localStorage.getItem(`cgc_acc_${c.id}_${x}`) === "true") {
          accessories.push({ console_id: c.id, accessory_index: x, owned: true });
        }
      });
    });
  } catch {}
  return { quotes, purchases, accessories };
}

export default function CollectionApp() {
  const { data, error, mutate } = useSWR<CollectionState>("/api/state", fetcher, {
    fallbackData: emptyState,
  });
  const state = data ?? emptyState;
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [openId, setOpenId] = useState<string | null>(null);
  const [hasBackup, setHasBackup] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("cgc_imported") === "done") return;
      const has = Object.keys(localStorage).some((k) => k.startsWith("cgc_") && k !== "cgc_theme");
      setHasBackup(has);
    } catch {}
  }, []);

  const doImport = async () => {
    setImporting(true);
    const payload = readLocalBackup();
    await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    try {
      localStorage.setItem("cgc_imported", "done");
    } catch {}
    setHasBackup(false);
    setImporting(false);
    mutate();
  };

  // ===== mutações com optimistic update =====
  const saveQuote = useCallback(
    (console_id: string, quote: number, notes: string) => {
      const optimistic: CollectionState = {
        ...state,
        quotes: [
          ...state.quotes.filter((q) => q.console_id !== console_id),
          { console_id, quote, notes },
        ],
      };
      mutate(
        async () => {
          await send("/api/quotes", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ console_id, quote, notes }),
          });
          return undefined;
        },
        { optimisticData: optimistic, populateCache: false, revalidate: true, rollbackOnError: true }
      );
    },
    [state, mutate]
  );

  const addPurchase = useCallback(
    (console_id: string, items: number[], price: number, note: string) => {
      const optimistic: CollectionState = {
        ...state,
        purchases: [
          ...state.purchases,
          { id: -Date.now(), console_id, items, price, note, purchased_at: new Date().toISOString() },
        ],
        accessories: [
          ...state.accessories.filter(
            (a) => !(a.console_id === console_id && items.includes(a.accessory_index))
          ),
          ...items.map((i) => ({ console_id, accessory_index: i, owned: true })),
        ],
      };
      mutate(
        async () => {
          await send("/api/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ console_id, items, price, note }),
          });
          return undefined;
        },
        { optimisticData: optimistic, populateCache: false, revalidate: true, rollbackOnError: true }
      );
    },
    [state, mutate]
  );

  const deletePurchase = useCallback(
    (id: number) => {
      const optimistic: CollectionState = {
        ...state,
        purchases: state.purchases.filter((p) => p.id !== id),
      };
      mutate(
        async () => {
          await send(`/api/purchases?id=${id}`, { method: "DELETE" });
          return undefined;
        },
        { optimisticData: optimistic, populateCache: false, revalidate: true, rollbackOnError: true }
      );
    },
    [state, mutate]
  );

  const toggleAccessory = useCallback(
    (console_id: string, accessory_index: number, owned: boolean) => {
      const optimistic: CollectionState = {
        ...state,
        accessories: [
          ...state.accessories.filter(
            (a) => !(a.console_id === console_id && a.accessory_index === accessory_index)
          ),
          ...(owned ? [{ console_id, accessory_index, owned: true }] : []),
        ],
      };
      mutate(
        async () => {
          await send("/api/accessories", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ console_id, accessory_index, owned }),
          });
          return undefined;
        },
        { optimisticData: optimistic, populateCache: false, revalidate: true, rollbackOnError: true }
      );
    },
    [state, mutate]
  );

  const filtered = useMemo(() => {
    const txt = filters.search.toLowerCase();
    return DB.filter((c) => {
      if (filters.brand !== "all" && c.brand !== filters.brand) return false;
      if (filters.family !== "all" && c.family !== filters.family) return false;
      if (filters.decade !== "all" && Math.floor(c.year / 10) * 10 !== +filters.decade) return false;
      if (filters.type !== "all" && c.type !== filters.type) return false;
      if (txt && !(c.name + c.brand + c.desc).toLowerCase().includes(txt)) return false;
      const invested = lotsTotal(state, c.id);
      const quote = Number(quoteOf(state, c.id)?.quote) || 0;
      if (filters.status === "owned" && invested <= 0) return false;
      if (filters.status === "quoted" && !(quote > 0 && invested <= 0)) return false;
      if (filters.status === "none" && (quote > 0 || invested > 0)) return false;
      if (filters.status === "fav" && !c.fav) return false;
      if (filters.status === "wall" && !c.wall) return false;
      return true;
    });
  }, [filters, state]);

  const openConsole = openId ? DB.find((c) => c.id === openId) : null;

  return (
    <main className="shell">
      <Header />
      <QuestLog state={state} />
      <StatTiles state={state} />

      {hasBackup && (
        <div className="import-banner">
          <p>
            Encontramos dados salvos localmente do tracker antigo (chaves <span className="mono">cgc_*</span>).
            Quer enviá-los para o banco online?
          </p>
          <button className="btn ghost" onClick={doImport} disabled={importing}>
            {importing ? "Importando..." : "Importar meus dados locais"}
          </button>
        </div>
      )}

      <ProjectBoard state={state} onOpen={setOpenId} />

      <Filters filters={filters} onChange={setFilters} />

      <div className="sec-head">
        <h2>
          Catálogo<span className="underbar" />
        </h2>
        <span className="ml mono">
          {pad(filtered.length)} / {pad(DB.length)}
          {error && <span className="sync-pill err"> · OFFLINE</span>}
        </span>
      </div>

      <div className="grid">
        {filtered.map((c, i) => (
          <ConsoleCard key={c.id} c={c} index={i} state={state} onOpen={setOpenId} />
        ))}
      </div>

      {openConsole && (
        <ConsoleModal
          c={openConsole}
          state={state}
          onClose={() => setOpenId(null)}
          onSaveQuote={(q, n) => saveQuote(openConsole.id, q, n)}
          onAddPurchase={(items, price, note) => addPurchase(openConsole.id, items, price, note)}
          onDeletePurchase={deletePurchase}
          onToggleAccessory={(x, owned) => toggleAccessory(openConsole.id, x, owned)}
        />
      )}

      <footer className="site">
        <span>Score: Cabral_Legacy</span>
        <span>System: Arcadia_G_3.0 — Sera</span>
      </footer>
    </main>
  );
}
