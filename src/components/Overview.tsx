"use client";

import { useMemo } from "react";
import { CollectionState, DB, totalAccessories } from "@/data/consoles";
import { computeProgress } from "@/lib/gamification";
import { fmt, pad } from "@/lib/collection";
import BrandLogo from "./BrandLogo";
import Constellation from "./Constellation";

/**
 * Visão geral do acervo: o estado da coleção em uma tela — patente e XP,
 * os números do catálogo, a constelação dos consoles e as próximas conquistas.
 */
export default function Overview({ state }: { state: CollectionState }) {
  const p = useMemo(() => computeProgress(state), [state]);
  const s = p.stats;

  const brands = useMemo(() => {
    const map = new Map<string, { total: number; owned: number }>();
    DB.forEach((c) => {
      const b = map.get(c.brand) ?? { total: 0, owned: 0 };
      b.total += 1;
      map.set(c.brand, b);
    });
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, []);

  // as três conquistas mais próximas de fechar, entre as que ainda faltam
  const next = [...p.achievements]
    .filter((a) => a.done < a.total)
    .sort((a, b) => b.done / b.total - a.done / a.total)
    .slice(0, 3);

  const accPct = Math.round((s.accessories / totalAccessories) * 100);
  const levelPct = Math.round((p.intoLevel / p.levelSpan) * 100);

  return (
    <section className="overview" aria-label="Visão geral do acervo">
      <div className="ov-top">
        <div className="ov-rank">
          <span className="ml">Patente atual</span>
          <h2 className="rank-title">{p.title}</h2>
          <div className="rank-line">
            <span className="lvl">NÍVEL {pad(p.level)}</span>
            <span className="xp mono">{p.xp.toLocaleString("pt-BR")} XP</span>
          </div>
          <div className="xpbar">
            <i style={{ width: `${levelPct}%` }} />
          </div>
          <p className="rank-next mono">
            {p.nextTitle
              ? `faltam ${p.xpToNext.toLocaleString("pt-BR")} XP para ${p.nextTitle}`
              : "patente máxima alcançada"}
          </p>
        </div>

        <dl className="ov-figures">
          <div>
            <dt>Consoles no catálogo</dt>
            <dd>{DB.length}</dd>
          </div>
          <div>
            <dt>Em casa</dt>
            <dd className="ok">{s.owned}</dd>
          </div>
          <div>
            <dt>Famílias mapeadas</dt>
            <dd>{s.families}</dd>
          </div>
          <div>
            <dt>Acessórios marcados</dt>
            <dd>
              {s.accessories}
              <small>de {totalAccessories} · {accPct}%</small>
            </dd>
          </div>
          <div>
            <dt>Investido</dt>
            <dd className="ok">R$ {fmt(s.invested)}</dd>
          </div>
          <div>
            <dt>Em cotações</dt>
            <dd className="acc">R$ {fmt(s.quotes)}</dd>
          </div>
          <div>
            <dt>Décadas cobertas</dt>
            <dd>{s.decades}<small>de 6</small></dd>
          </div>
          <div>
            <dt>Conquistas</dt>
            <dd>{s.brands > 0 || p.unlocked > 0 ? p.unlocked : 0}<small>de {p.achievements.length}</small></dd>
          </div>
        </dl>
      </div>

      <Constellation state={state} />

      <div className="ov-goals">
        <div className="goals-head">
          <h3>Próximas conquistas</h3>
          <span className="ml mono">
            {pad(p.unlocked)} / {pad(p.achievements.length)} desbloqueadas
          </span>
        </div>
        <div className="goals">
          {next.map((a) => (
            <article className="goal" key={a.id}>
              <h4>{a.title}</h4>
              <p>{a.goal}</p>
              <div className="goal-bar">
                <i style={{ width: `${Math.round((a.done / a.total) * 100)}%` }} />
              </div>
              <span className="goal-foot mono">
                {a.done}/{a.total} · +{a.xp} XP
              </span>
            </article>
          ))}
          {next.length === 0 && <p className="goal-empty">Todas as conquistas desbloqueadas.</p>}
        </div>
      </div>

      <div className="ov-brands">
        <span className="ml">Fabricantes no acervo</span>
        <div className="brand-strip">
          {brands.map(([name, info]) => (
            <span className="brand-chip" key={name} title={`${name} — ${info.total} no catálogo`}>
              <BrandLogo brand={name} size="md" />
              <span className="brand-count mono">{pad(info.total)}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
