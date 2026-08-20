"use client";

import { GameConsole } from "@/data/consoles";
import { deviceForm } from "@/lib/deviceForm";
import { brandStyle } from "./BrandLogo";

/**
 * Imagem do aparelho no catálogo. Quando existe uma foto em
 * `public/consoles/<id>.jpg` (baixada pelo script scripts/fetch-photos.ts),
 * ela é usada; enquanto não existe, o console aparece como um desenho do seu
 * formato físico, na cor do fabricante — o suficiente para bater o olho e
 * reconhecer se é de mesa, portátil, de concha ou add-on.
 */
export default function DevicePhoto({ c, size = "card" }: { c: GameConsole; size?: "card" | "modal" }) {
  if (c.photo) {
    return (
      <figure className={`shot shot-${size} shot-photo`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.photo} alt={c.name} loading="lazy" />
        {c.photoCredit && size === "modal" && <figcaption className="mono">{c.photoCredit}</figcaption>}
      </figure>
    );
  }
  return (
    <figure className={`shot shot-${size}`}>
      <DeviceDrawing c={c} />
    </figure>
  );
}

function DeviceDrawing({ c }: { c: GameConsole }) {
  const form = deviceForm(c);
  const color = brandStyle(c.brand).color;
  return (
    <svg viewBox="0 0 320 170" className="device" role="img" aria-label={`Desenho do ${c.name}`}>
      <defs>
        <linearGradient id={`g-${c.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="170" fill={`url(#g-${c.id})`} />
      <g className="dv" style={{ color }}>
        <Body form={form} />
      </g>
      <text x="14" y="158" className="device-tag">
        {formLabel(form)}
      </text>
    </svg>
  );
}

function formLabel(f: string) {
  if (f === "handheld") return "PORTÁTIL";
  if (f === "clamshell") return "PORTÁTIL DE CONCHA";
  if (f === "tower") return "TORRE VERTICAL";
  if (f === "addon") return "MÓDULO ADD-ON";
  if (f === "tabletop") return "COM TELA INTEGRADA";
  if (f === "hybrid") return "HÍBRIDO";
  if (f === "slab-disc") return "MESA · LEITOR DE DISCO";
  return "MESA · CARTUCHO";
}

function Body({ form }: { form: string }) {
  const shell = "dv-shell";
  const detail = "dv-detail";
  const glass = "dv-glass";

  if (form === "tower") {
    return (
      <>
        <rect x="128" y="24" width="64" height="112" className={shell} />
        <rect x="128" y="24" width="64" height="10" className={detail} />
        <rect x="140" y="112" width="40" height="4" className={detail} />
        <rect x="150" y="136" width="20" height="6" className={detail} />
      </>
    );
  }
  if (form === "handheld") {
    return (
      <>
        <rect x="126" y="18" width="68" height="124" className={shell} />
        <rect x="138" y="30" width="44" height="38" className={glass} />
        <rect x="140" y="86" width="16" height="6" className={detail} />
        <rect x="145" y="81" width="6" height="16" className={detail} />
        <circle cx="172" cy="88" r="5" className={detail} />
        <circle cx="184" cy="94" r="5" className={detail} />
        <rect x="148" y="118" width="24" height="4" className={detail} />
      </>
    );
  }
  if (form === "clamshell") {
    return (
      <>
        <rect x="96" y="16" width="128" height="66" className={shell} />
        <rect x="110" y="26" width="100" height="46" className={glass} />
        <rect x="96" y="86" width="128" height="66" className={shell} />
        <rect x="110" y="94" width="100" height="34" className={glass} />
        <rect x="118" y="134" width="18" height="5" className={detail} />
        <circle cx="196" cy="136" r="5" className={detail} />
        <rect x="96" y="82" width="128" height="4" className={detail} />
      </>
    );
  }
  if (form === "tabletop") {
    return (
      <>
        <rect x="98" y="14" width="124" height="112" className={shell} />
        <rect x="112" y="26" width="96" height="64" className={glass} />
        <rect x="120" y="100" width="80" height="14" className={detail} />
        <rect x="140" y="126" width="40" height="10" className={detail} />
      </>
    );
  }
  if (form === "addon") {
    return (
      <>
        <rect x="72" y="52" width="140" height="58" className={shell} />
        <rect x="212" y="66" width="36" height="30" className={detail} />
        <rect x="88" y="66" width="60" height="8" className={detail} />
        <rect x="88" y="86" width="34" height="6" className={detail} />
      </>
    );
  }
  if (form === "hybrid") {
    return (
      <>
        <rect x="104" y="42" width="112" height="76" className={shell} />
        <rect x="116" y="52" width="88" height="56" className={glass} />
        <rect x="76" y="42" width="24" height="76" className={detail} />
        <rect x="220" y="42" width="24" height="76" className={detail} />
        <circle cx="88" cy="66" r="5" className={glass} />
        <circle cx="232" cy="94" r="5" className={glass} />
      </>
    );
  }
  if (form === "slab-disc") {
    return (
      <>
        <rect x="56" y="52" width="208" height="66" className={shell} />
        <rect x="56" y="52" width="208" height="8" className={detail} />
        <circle cx="160" cy="88" r="22" className={detail} />
        <circle cx="160" cy="88" r="6" className={glass} />
        <rect x="76" y="104" width="26" height="6" className={detail} />
        <rect x="220" y="104" width="26" height="6" className={detail} />
      </>
    );
  }
  return (
    <>
      <rect x="56" y="54" width="208" height="62" className={shell} />
      <rect x="118" y="42" width="84" height="18" className={detail} />
      <rect x="132" y="46" width="56" height="8" className={glass} />
      <rect x="76" y="98" width="40" height="8" className={detail} />
      <rect x="204" y="98" width="40" height="8" className={detail} />
    </>
  );
}
