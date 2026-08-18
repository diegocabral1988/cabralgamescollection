import { CollectionState, GameConsole, Purchase } from "@/data/consoles";

export const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

export const pad = (n: number) => String(n).padStart(2, "0");

export const emptyState: CollectionState = { quotes: [], purchases: [], accessories: [] };

export function quoteOf(state: CollectionState, id: string) {
  return state.quotes.find((q) => q.console_id === id);
}

export function lotsOf(state: CollectionState, id: string): Purchase[] {
  return state.purchases.filter((p) => p.console_id === id);
}

export function lotsTotal(state: CollectionState, id: string) {
  return lotsOf(state, id).reduce((s, l) => s + (Number(l.price) || 0), 0);
}

export function ownedSet(state: CollectionState, id: string) {
  const s = new Set<number>();
  state.accessories.forEach((a) => {
    if (a.console_id === id && a.owned) s.add(a.accessory_index);
  });
  return s;
}

export function boughtSet(state: CollectionState, id: string) {
  const s = new Set<number>();
  lotsOf(state, id).forEach((l) => l.items.forEach((x) => s.add(x)));
  return s;
}

export function accProgress(state: CollectionState, c: GameConsole) {
  const owned = ownedSet(state, c.id);
  const done = c.acc.filter((_, x) => owned.has(x)).length;
  return Math.round((done / c.acc.length) * 100);
}
