"use client";

/**
 * Arte dos painéis da parede: logo recortado à esquerda, console montado à
 * direita e o controle no suporte inferior — a mesma leitura da foto de
 * referência do projeto. Tudo em SVG/blocos para escalar sem imagem externa.
 */

/** Monograma clássico do PlayStation (o "PS" em perspectiva do painel de cima). */
export function PsMonogram() {
  return (
    <svg className="ps-mark" viewBox="0 0 120 96" role="img" aria-label="Logo PlayStation">
      {/* haste e cabeça do P */}
      <path d="M40 4h26c13 0 22 9 22 21s-9 21-22 21H56v14H40z" fill="currentColor" />
      <path d="M56 19h9c5 0 8 3 8 6s-3 6-8 6h-9z" className="ps-mark-cut" />
      {/* S deitado em perspectiva, mais claro, como no logo original */}
      <path
        d="M12 90c-8-5-11-13-6-20 6-9 20-14 38-16l48-6c9-1 15 2 16 6 1 5-4 9-13 11l-22 5 3 9 28-7c17-4 25-14 20-23-5-9-19-13-36-11l-50 7C18 47 5 55 2 66c-3 12 4 21 22 27z"
        className="ps-mark-s"
      />
    </svg>
  );
}

/** Letreiro fino e alongado das gerações seguintes (PS2, PS3, PS4, PS5). */
export function PsWordmark({ label }: { label: string }) {
  return (
    <span className="ps-word" aria-hidden="true">
      {label}
    </span>
  );
}

/** Silhueta do console montado no painel — muda de forma conforme a geração. */
export function ConsoleArt({ shape }: { shape: string }) {
  if (shape === "ps1") {
    return (
      <span className="art art-ps1" aria-hidden="true">
        <svg viewBox="0 0 120 80" className="art-svg">
          <rect x="2" y="10" width="116" height="60" className="art-body-1" />
          <circle cx="60" cy="40" r="21" className="art-lid" />
          <circle cx="60" cy="40" r="6" className="art-hub" />
          <rect x="14" y="60" width="12" height="6" className="art-btn" />
          <rect x="94" y="60" width="12" height="6" className="art-btn" />
        </svg>
      </span>
    );
  }
  if (shape === "ps2") {
    return (
      <span className="art art-ps2" aria-hidden="true">
        <svg viewBox="0 0 60 120" className="art-svg">
          <rect x="6" y="2" width="48" height="116" className="art-body-2" />
          <rect x="6" y="2" width="10" height="116" className="art-face" />
          <rect x="22" y="86" width="24" height="4" className="art-line" />
        </svg>
      </span>
    );
  }
  if (shape === "ps3") {
    return (
      <span className="art art-ps3" aria-hidden="true">
        <svg viewBox="0 0 96 110" className="art-svg">
          <rect x="4" y="6" width="88" height="98" className="art-body-2" />
          <rect x="4" y="6" width="88" height="10" className="art-face" />
          <rect x="60" y="86" width="26" height="4" className="art-line" />
        </svg>
      </span>
    );
  }
  return (
    <span className="art art-ps4" aria-hidden="true">
      <svg viewBox="0 0 120 76" className="art-svg">
        <polygon points="4,20 116,6 116,58 4,70" className="art-body-2" />
        <polygon points="4,20 116,6 116,16 4,30" className="art-face" />
      </svg>
    </span>
  );
}

/** Controle pendurado no suporte em L, abaixo do logo. */
export function PadArt() {
  return (
    <span className="pad" aria-hidden="true">
      <svg viewBox="0 0 90 46" className="pad-svg">
        <rect x="4" y="6" width="82" height="22" className="pad-body" />
        <rect x="0" y="16" width="16" height="20" className="pad-body" />
        <rect x="74" y="16" width="16" height="20" className="pad-body" />
        <rect x="20" y="12" width="12" height="4" className="pad-dot" />
        <rect x="58" y="12" width="12" height="4" className="pad-dot" />
      </svg>
      <i className="pad-mount" />
    </span>
  );
}
