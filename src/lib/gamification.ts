import { CollectionState, DB, totalAccessories } from "@/data/consoles";
import { FRAMES, WALL } from "@/data/projects";
import { lotsTotal, ownedSet, quoteOf } from "./collection";

/** Quanto cada ação do colecionador vale em XP. */
export const XP = {
  quote: 5,
  accessory: 10,
  console: 100,
  panel: 150,
  frame: 60,
} as const;

/** Patentes do acervo — cada faixa exige o dobro de esforço da anterior. */
export const RANKS = [
  { level: 1, xp: 0, title: "Garimpeiro de feira" },
  { level: 2, xp: 300, title: "Caçador de lote" },
  { level: 3, xp: 800, title: "Colecionador de fim de semana" },
  { level: 4, xp: 1600, title: "Restaurador de bancada" },
  { level: 5, xp: 3000, title: "Curador do acervo" },
  { level: 6, xp: 5200, title: "Arquivista 16-bit" },
  { level: 7, xp: 8000, title: "Guardião das gerações" },
  { level: 8, xp: 12000, title: "Lenda do Cabral Games" },
];

export interface Achievement {
  id: string;
  title: string;
  /** O que precisa ser feito, em uma linha. */
  goal: string;
  done: number;
  total: number;
  xp: number;
}

export interface Progress {
  xp: number;
  level: number;
  title: string;
  /** XP dentro da faixa atual e quanto falta para a próxima. */
  intoLevel: number;
  levelSpan: number;
  nextTitle: string | null;
  xpToNext: number;
  achievements: Achievement[];
  unlocked: number;
  stats: {
    owned: number;
    quoted: number;
    accessories: number;
    invested: number;
    quotes: number;
    families: number;
    familiesComplete: number;
    decades: number;
    brands: number;
    panels: number;
    frames: number;
  };
}

const frameKey = (id: string) => `cgc_frame_${id}`;

function framesBought() {
  if (typeof window === "undefined") return 0;
  try {
    return FRAMES.filter((f) => localStorage.getItem(frameKey(f.id)) === "true").length;
  } catch {
    return 0;
  }
}

export function computeProgress(state: CollectionState): Progress {
  const ownedConsoles = DB.filter((c) => lotsTotal(state, c.id) > 0);
  const accessories = DB.reduce((s, c) => s + ownedSet(state, c.id).size, 0);
  const quoted = DB.filter((c) => Number(quoteOf(state, c.id)?.quote) > 0).length;
  const invested = DB.reduce((s, c) => s + lotsTotal(state, c.id), 0);
  const quotes = DB.reduce((s, c) => s + (Number(quoteOf(state, c.id)?.quote) || 0), 0);
  const panels = WALL.filter((w) => lotsTotal(state, w.consoleId) > 0).length;
  const frames = framesBought();

  const families = new Map<string, { total: number; owned: number }>();
  DB.forEach((c) => {
    if (!c.family) return;
    const f = families.get(c.family) ?? { total: 0, owned: 0 };
    f.total += 1;
    if (lotsTotal(state, c.id) > 0) f.owned += 1;
    families.set(c.family, f);
  });
  const familiesComplete = [...families.values()].filter((f) => f.owned === f.total).length;
  const familiesStarted = [...families.values()].filter((f) => f.owned > 0).length;

  const decades = new Set(ownedConsoles.map((c) => Math.floor(c.year / 10) * 10)).size;
  const brands = new Set(ownedConsoles.map((c) => c.brand)).size;

  const xp =
    quoted * XP.quote +
    accessories * XP.accessory +
    ownedConsoles.length * XP.console +
    panels * XP.panel +
    frames * XP.frame;

  let rank = RANKS[0];
  for (const r of RANKS) if (xp >= r.xp) rank = r;
  const next = RANKS.find((r) => r.xp > xp) ?? null;
  const levelSpan = next ? next.xp - rank.xp : 1;

  const achievements: Achievement[] = [
    { id: "first", title: "Primeira aquisição", goal: "Registrar a compra de um console", done: Math.min(ownedConsoles.length, 1), total: 1, xp: 50 },
    { id: "five", title: "Prateleira montada", goal: "Ter cinco consoles em casa", done: Math.min(ownedConsoles.length, 5), total: 5, xp: 150 },
    { id: "twenty", title: "Acervo respeitável", goal: "Chegar a vinte consoles adquiridos", done: Math.min(ownedConsoles.length, 20), total: 20, xp: 400 },
    { id: "family", title: "Linhagem completa", goal: "Fechar todos os modelos de uma família", done: Math.min(familiesComplete, 1), total: 1, xp: 300 },
    { id: "families3", title: "Colecionador de linhagens", goal: "Começar cinco famílias diferentes", done: Math.min(familiesStarted, 5), total: 5, xp: 250 },
    { id: "wall", title: "Parede PlayStation", goal: "Ter os cinco consoles dos painéis", done: panels, total: WALL.length, xp: 500 },
    { id: "frames", title: "Bancada de quadros", goal: "Comprar as peças dos quatro shadow box", done: frames, total: FRAMES.length, xp: 200 },
    { id: "acc100", title: "Caixa de acessórios", goal: "Marcar cem acessórios como seus", done: Math.min(accessories, 100), total: 100, xp: 300 },
    { id: "decades", title: "Viajante do tempo", goal: "Ter um console de cinco décadas diferentes", done: Math.min(decades, 5), total: 5, xp: 350 },
    { id: "brands", title: "Guerra dos consoles", goal: "Ter consoles de seis fabricantes", done: Math.min(brands, 6), total: 6, xp: 300 },
    { id: "quoted", title: "Mercado mapeado", goal: "Cotar trinta consoles do catálogo", done: Math.min(quoted, 30), total: 30, xp: 200 },
    { id: "complete", title: "Acervo completo", goal: "Adquirir todos os consoles do catálogo", done: ownedConsoles.length, total: DB.length, xp: 2000 },
  ];

  return {
    xp,
    level: rank.level,
    title: rank.title,
    intoLevel: xp - rank.xp,
    levelSpan,
    nextTitle: next?.title ?? null,
    xpToNext: next ? next.xp - xp : 0,
    achievements,
    unlocked: achievements.filter((a) => a.done >= a.total).length,
    stats: {
      owned: ownedConsoles.length,
      quoted,
      accessories,
      invested,
      quotes,
      families: families.size,
      familiesComplete,
      decades,
      brands,
      panels,
      frames,
    },
  };
}

export const totalAccessoriesInCatalog = totalAccessories;
