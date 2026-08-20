"use client";

import { useEffect, useState } from "react";
import { CollectionState, DB } from "@/data/consoles";
import { FRAMES, WALL, WALL_MATERIALS, framesBudgetLabel } from "@/data/projects";
import { lotsTotal, pad } from "@/lib/collection";
import { ConsoleArt, PadArt, PsMonogram, PsWordmark } from "./PsPanelArt";
import ShadowBoxArt from "./ShadowBoxArt";

const FRAME_KEY = "cgc_frame_";

/**
 * Sala de exposição: a parede de painéis dos PlayStation e os quadros shadow box.
 * Os painéis puxam o status real do catálogo (console já adquirido ou não);
 * os quadros são tarefas de compra de peças quebradas, marcadas localmente.
 */
export default function ProjectBoard({
  state,
  onOpen,
}: {
  state: CollectionState;
  onOpen: (id: string) => void;
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const next: Record<string, boolean> = {};
    try {
      FRAMES.forEach((f) => {
        next[f.id] = localStorage.getItem(FRAME_KEY + f.id) === "true";
      });
    } catch {}
    setDone(next);
  }, []);

  const toggle = (id: string) => {
    const next = !done[id];
    setDone((d) => ({ ...d, [id]: next }));
    try {
      localStorage.setItem(FRAME_KEY + id, String(next));
    } catch {}
  };

  const panels = [...WALL].sort((a, b) => a.order - b.order);
  const ready = panels.filter((p) => lotsTotal(state, p.consoleId) > 0).length;
  const framesDone = FRAMES.filter((f) => done[f.id]).length;

  return (
    <section className="project" aria-label="Projetos de exposição">
      <div className="sec-head">
        <h2>
          Projeto de parede — PlayStation<span className="underbar" />
        </h2>
        <span className="ml mono">
          {pad(ready)} / {pad(panels.length)} painéis com console em casa
        </span>
      </div>

      <p className="project-lead">
        Um painel de MDF branco por geração, empilhados na parede: logo recortado à esquerda,
        console à direita e o controle no suporte inferior. Clique no painel para abrir a ficha do
        console e registrar cotação, compras e acessórios.
      </p>

      <div className="wall">
        {panels.map((p) => {
          const c = DB.find((x) => x.id === p.consoleId);
          const owned = lotsTotal(state, p.consoleId) > 0;
          return (
            <button
              key={p.consoleId}
              className={`panel panel-${p.shape}${owned ? " owned" : ""}`}
              onClick={() => onOpen(p.consoleId)}
              aria-label={`Painel ${p.label} — ${c?.name ?? p.consoleId}`}
            >
              {/* parafusos dos quatro cantos, como no painel de MDF real */}
              <i className="screw s-tl" aria-hidden="true" />
              <i className="screw s-tr" aria-hidden="true" />
              <i className="screw s-bl" aria-hidden="true" />
              <i className="screw s-br" aria-hidden="true" />

              <span className="p-left">
                {p.label === "PS" ? <PsMonogram /> : <PsWordmark label={p.label} />}
                <PadArt />
              </span>
              <span className="p-right">
                <ConsoleArt shape={p.shape} />
              </span>

              <span className="p-info">
                <span className="p-name">{c?.name ?? p.consoleId}</span>
                <span className="p-note">{p.note}</span>
                <span className="p-foot mono">
                  {p.size} · {c?.year ?? "—"} · {owned ? "CONSOLE EM CASA" : "A ADQUIRIR"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mat">
        <span className="ml">Lista de materiais da parede</span>
        <ul>
          {WALL_MATERIALS.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>

      <div className="sec-head frames-head">
        <h2>
          Quadros shadow box — peças desmontadas<span className="underbar" />
        </h2>
        <span className="ml mono">
          {pad(framesDone)} / {pad(FRAMES.length)} peças doadoras compradas
        </span>
      </div>

      <p className="project-lead">
        Quadros pequenos com o aparelho aberto e cada peça legendada. Como a peça nunca mais volta a
        funcionar, o alvo de compra é sempre uma unidade <b>quebrada / para retirada de peças</b> —
        muito mais barata que uma funcionando. Orçamento estimado: <b>{framesBudgetLabel}</b>.
      </p>

      <div className="frames">
        {FRAMES.map((f) => (
          <article key={f.id} className={`frame${done[f.id] ? " done" : ""}`}>
            <div className="f-top">
              <h3>{f.title}</h3>
              <label className="f-check">
                <input type="checkbox" checked={!!done[f.id]} onChange={() => toggle(f.id)} />
                <span>Peça comprada</span>
              </label>
            </div>
            <div className="f-art">
              <ShadowBoxArt id={f.id} />
            </div>
            <p className="f-sub">{f.subtitle}</p>
            <div className="rows">
              <div className="info-row">
                <span className="k">Comprar</span>
                <span className="v">{f.donor}</span>
              </div>
              <div className="info-row">
                <span className="k">Faixa de preço</span>
                <span className="v acc">{f.budget}</span>
              </div>
              <div className="info-row">
                <span className="k">Moldura</span>
                <span className="v">{f.frame}</span>
              </div>
            </div>
            <ol className="f-steps">
              {f.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            {f.consoleId && (
              <button className="btn ghost full" onClick={() => onOpen(f.consoleId!)}>
                Abrir ficha do console
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
