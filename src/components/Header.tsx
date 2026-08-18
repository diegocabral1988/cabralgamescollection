"use client";

import { useEffect, useRef, useState } from "react";
import { DB } from "@/data/consoles";
import { pad } from "@/lib/collection";

const TAGLINE = "ACERVO RETRÔ · COTAÇÃO · AQUISIÇÃO · LEGADO";

function Typewriter() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(TAGLINE);
      setDone(true);
      return;
    }
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const type = () => {
      if (i <= TAGLINE.length) {
        setText(TAGLINE.slice(0, i++));
        timers.push(setTimeout(type, 36));
      } else {
        timers.push(setTimeout(() => setDone(true), 1200));
      }
    };
    timers.push(setTimeout(type, 350));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <p className="tagline">
      <span className="tw" aria-label={TAGLINE}>
        {text}
      </span>
      {!done && <span className="tw-cursor" aria-hidden="true" />}
    </p>
  );
}

export default function Header() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("cgc_theme", next ? "light" : "dark");
    } catch {}
  };

  const tickerItems = DB.map((c, i) => (
    <span key={c.id}>
      <i>{pad(i + 1)}</i>
      {c.name} · {c.year}
    </span>
  ));

  return (
    <header className="site">
      <div className="topbar">
        <span className="sys">
          <span className="dot" aria-hidden="true" />
          SYSTEM ONLINE · ARCADIA_G_3.0
        </span>
        <button className="theme-btn" onClick={toggle} aria-pressed={light}>
          {light ? "Modo escuro" : "Modo claro"}
        </button>
      </div>
      <h1 className="brand">
        CABRAL <b>GAMES</b> COLLECTION
      </h1>
      <Typewriter />
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {tickerItems}
          {DB.map((c, i) => (
            <span key={c.id + "-2"}>
              <i>{pad(i + 1)}</i>
              {c.name} · {c.year}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
