"use client";

/**
 * Marcas dos fabricantes desenhadas em SVG — versões estilizadas, feitas para o
 * acervo, não reproduções oficiais. Cada fabricante tem cor e forma próprias
 * para dar leitura rápida no catálogo.
 */

interface BrandStyle {
  /** Sigla/letreiro mostrado na marca. */
  text: string;
  color: string;
  /** Forma de fundo que caracteriza o fabricante. */
  shape: "pill" | "block" | "oval" | "orb" | "arc" | "hex";
}

const BRANDS: Record<string, BrandStyle> = {
  Nintendo: { text: "Nintendo", color: "#E4000F", shape: "pill" },
  Sony: { text: "SONY", color: "#1E4FD8", shape: "block" },
  Sega: { text: "SEGA", color: "#0072CE", shape: "oval" },
  Microsoft: { text: "XBOX", color: "#63C623", shape: "orb" },
  Atari: { text: "ATARI", color: "#E03A28", shape: "arc" },
  SNK: { text: "SNK", color: "#E8A020", shape: "block" },
  NEC: { text: "NEC", color: "#3D6BB5", shape: "block" },
  Philips: { text: "PHILIPS", color: "#0B5ED7", shape: "oval" },
  Magnavox: { text: "MAGNAVOX", color: "#8A6BD1", shape: "arc" },
  "Magnavox/Philips": { text: "ODYSSEY²", color: "#8A6BD1", shape: "arc" },
  Mattel: { text: "MATTEL", color: "#D5266B", shape: "pill" },
  Coleco: { text: "COLECO", color: "#C9432F", shape: "block" },
  Fairchild: { text: "FAIRCHILD", color: "#6E8E3C", shape: "hex" },
  "GCE/MB": { text: "VECTREX", color: "#4FA6A0", shape: "hex" },
  Panasonic: { text: "3DO", color: "#2E7BC4", shape: "orb" },
  Bandai: { text: "BANDAI", color: "#D94A3D", shape: "oval" },
  Commodore: { text: "COMMODORE", color: "#4A7FC1", shape: "arc" },
  "Apple/Bandai": { text: "PIPPIN", color: "#7C8B96", shape: "orb" },
  Nokia: { text: "NOKIA", color: "#1B72C4", shape: "pill" },
  Tectoy: { text: "TECTOY", color: "#E4A400", shape: "block" },
  "Tectoy/Sega": { text: "TECTOY·SEGA", color: "#E4A400", shape: "oval" },
  "Tectoy/Qualcomm": { text: "ZEEBO", color: "#E4A400", shape: "hex" },
};

const FALLBACK: BrandStyle = { text: "RETRO", color: "#8C97A8", shape: "block" };

export function brandStyle(brand: string): BrandStyle {
  return BRANDS[brand] ?? FALLBACK;
}

export function brandList() {
  return Object.entries(BRANDS).map(([name, style]) => ({ name, ...style }));
}

/** Onde o letreiro fica em cada forma — nenhuma forma cruza o texto. */
const TEXT_POS: Record<BrandStyle["shape"], { x: number; y: number; anchor: "middle" | "start" }> = {
  pill: { x: 60, y: 20, anchor: "middle" },
  block: { x: 60, y: 20, anchor: "middle" },
  oval: { x: 60, y: 20, anchor: "middle" },
  hex: { x: 60, y: 20, anchor: "middle" },
  orb: { x: 40, y: 20, anchor: "start" },
  arc: { x: 60, y: 26, anchor: "middle" },
};

function Shape({ shape, color }: { shape: BrandStyle["shape"]; color: string }) {
  const stroke = { stroke: color, fill: "none", strokeWidth: 2 } as const;
  if (shape === "pill") return <rect x="2" y="10" width="116" height="20" rx="10" ry="10" {...stroke} />;
  if (shape === "oval") return <ellipse cx="60" cy="20" rx="57" ry="14" {...stroke} />;
  if (shape === "hex") return <polygon points="14,4 106,4 118,20 106,36 14,36 2,20" {...stroke} />;
  // esfera à esquerda, letreiro à direita — o texto nunca passa por dentro
  if (shape === "orb")
    return (
      <>
        <circle cx="20" cy="20" r="13" {...stroke} />
        <path d="M12 11c7 5 10 11 10 18" {...stroke} strokeWidth={1.4} />
      </>
    );
  // arco por cima do letreiro
  if (shape === "arc")
    return (
      <>
        <path d="M6 12c14-12 34-12 54-12s40 0 54 12" {...stroke} />
        <line x1="6" y1="34" x2="114" y2="34" {...stroke} strokeWidth={1.2} />
      </>
    );
  return <rect x="2" y="6" width="116" height="28" {...stroke} />;
}

/** Marca do fabricante, em duas medidas: `sm` no card, `md` na faixa de marcas. */
export default function BrandLogo({ brand, size = "sm" }: { brand: string; size?: "sm" | "md" }) {
  const style = brandStyle(brand);
  return (
    <svg
      viewBox="0 0 120 40"
      className={`brand-logo brand-${size}`}
      style={{ color: style.color }}
      role="img"
      aria-label={brand}
    >
      <Shape shape={style.shape} color="currentColor" />
      <text
        x={TEXT_POS[style.shape].x}
        y={TEXT_POS[style.shape].y}
        className="brand-text"
        style={{ fontSize: style.text.length > 7 ? 11 : style.text.length > 5 ? 13 : 15 }}
        textAnchor={TEXT_POS[style.shape].anchor}
        dominantBaseline="central"
      >
        {style.text}
      </text>
    </svg>
  );
}
