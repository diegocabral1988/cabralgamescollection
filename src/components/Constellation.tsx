"use client";

import { useEffect, useRef } from "react";
import { CollectionState, DB } from "@/data/consoles";
import { lotsTotal, quoteOf } from "@/lib/collection";

/**
 * A constelação do acervo: cada console do catálogo é um ponto posicionado pelo
 * ano de lançamento (1972 → 2025). Curvas ligam os modelos de uma mesma família.
 * Ponto aceso = console em casa; anel = console cotado; ponto apagado = a caçar.
 * O movimento é uma respiração lenta — nada pisca nem corre.
 */
export default function Constellation({ state }: { state: CollectionState }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minYear = Math.min(...DB.map((c) => c.year));
    const maxYear = Math.max(...DB.map((c) => c.year));

    // posição vertical estável por console (hash do id), para o desenho não dançar
    const hash = (s: string) => {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
      return h / 1000;
    };

    const nodes = DB.map((c, i) => ({
      id: c.id,
      family: c.family ?? c.id,
      tx: (c.year - minYear) / (maxYear - minYear),
      ty: hash(c.id),
      owned: lotsTotal(state, c.id) > 0,
      quoted: Number(quoteOf(state, c.id)?.quote) > 0,
      phase: (i % 12) * 0.52,
    }));

    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#3f9e6a";
    const owned = styles.getPropertyValue("--success").trim() || "#e0a83c";

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const pad = 26;
      const w = width - pad * 2;
      const h = height - pad * 2;

      const at = (n: (typeof nodes)[number]) => {
        const drift = reduced ? 0 : Math.sin(t / 2600 + n.phase) * 7;
        return {
          x: pad + n.tx * w,
          // leve arco: a linha do tempo sobe no meio, como a curva de uma trilha
          y: pad + n.ty * h * 0.82 + drift - Math.sin(n.tx * Math.PI) * h * 0.08,
        };
      };

      // marcações de década ao fundo
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1;
      for (let y = 1980; y <= 2020; y += 10) {
        const x = pad + ((y - minYear) / (maxYear - minYear)) * w;
        ctx.beginPath();
        ctx.moveTo(x, pad * 0.4);
        ctx.lineTo(x, height - pad * 0.4);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // curvas ligando os modelos de uma mesma família
      const byFamily = new Map<string, typeof nodes>();
      nodes.forEach((n) => {
        const arr = byFamily.get(n.family) ?? [];
        arr.push(n);
        byFamily.set(n.family, arr);
      });
      byFamily.forEach((group) => {
        if (group.length < 2) return;
        const pts = group.map(at);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          const prev = pts[i - 1];
          const cur = pts[i];
          const cx = (prev.x + cur.x) / 2;
          ctx.bezierCurveTo(cx, prev.y, cx, cur.y, cur.x, cur.y);
        }
        const lit = group.some((n) => n.owned);
        ctx.strokeStyle = lit ? owned : accent;
        ctx.globalAlpha = lit ? 0.4 : 0.16;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // pontos
      ctx.globalAlpha = 1;
      nodes.forEach((n) => {
        const { x, y } = at(n);
        if (n.owned) {
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = owned;
          ctx.globalAlpha = 0.18;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 2.6, 0, Math.PI * 2);
          ctx.globalAlpha = 1;
          ctx.fill();
        } else if (n.quoted) {
          ctx.beginPath();
          ctx.arc(x, y, 3.4, 0, Math.PI * 2);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.85;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.globalAlpha = 0.4;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [state]);

  return (
    <div className="constellation">
      <canvas ref={ref} aria-hidden="true" />
      <div className="const-scale mono" aria-hidden="true">
        <span>1972</span>
        <span>1990</span>
        <span>2005</span>
        <span>2025</span>
      </div>
      <p className="const-legend mono">
        <span className="lg own">Em casa</span>
        <span className="lg quo">Cotado</span>
        <span className="lg none">A caçar</span>
        <span className="lg line">Curvas ligam os modelos de uma família</span>
      </p>
    </div>
  );
}
